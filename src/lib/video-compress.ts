// In-browser video compression for the admin back office.
//
// Supabase's plan caps uploads at ~50 MB, and most campaign videos are long
// 1080p files far over that. When staff pick an oversized video, we re-encode
// it right in the browser: decode through a hidden <video>, downscale onto a
// canvas (max 1280 wide), route the audio through WebAudio, and record both
// with MediaRecorder at a bitrate computed to land the file near 44 MB.
// Runs in real time (a 3-minute video takes ~3 minutes) with live progress.

const TARGET_MB = 44;
const AUDIO_BPS = 128_000;

export async function compressVideoInBrowser(
  file: File,
  onProgress?: (label: string) => void,
): Promise<File> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  let ac: AudioContext | null = null;
  let raf = 0;
  try {
    video.src = url;
    video.playsInline = true;
    video.preload = "auto";
    await new Promise<void>((res, rej) => {
      video.onloadedmetadata = () => res();
      video.onerror = () => rej(new Error("Could not read this video file."));
    });

    const duration = video.duration;
    if (!isFinite(duration) || duration <= 0) throw new Error("Could not read video length.");

    const scale = Math.min(1, 1280 / video.videoWidth);
    const w = Math.max(2, Math.round((video.videoWidth * scale) / 2) * 2);
    const h = Math.max(2, Math.round((video.videoHeight * scale) / 2) * 2);
    const videoBps = Math.max(700_000, Math.min(3_500_000,
      Math.floor((TARGET_MB * 1024 * 1024 * 8) / duration) - AUDIO_BPS));

    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const stream = canvas.captureStream(30);

    // Route audio into the recording (and away from the speakers).
    ac = new AudioContext();
    const srcNode = ac.createMediaElementSource(video);
    const dest = ac.createMediaStreamDestination();
    srcNode.connect(dest);
    dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));

    const mime = [
      'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
      "video/mp4",
      'video/webm;codecs="vp9,opus"',
      "video/webm",
    ].find(m => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m));
    if (!mime) throw new Error("This browser can't compress video.");

    const rec = new MediaRecorder(stream, {
      mimeType: mime,
      videoBitsPerSecond: videoBps,
      audioBitsPerSecond: AUDIO_BPS,
    });
    const chunks: Blob[] = [];
    rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    const stopped = new Promise<void>(res => { rec.onstop = () => res(); });

    const mins = Math.ceil(duration / 60);
    const draw = () => {
      ctx.drawImage(video, 0, 0, w, h);
      onProgress?.(`Compressing video… ${Math.min(99, Math.round((video.currentTime / duration) * 100))}% (takes ~${mins} min)`);
      raf = requestAnimationFrame(draw);
    };

    rec.start(1000);
    await video.play();
    draw();
    await new Promise<void>(res => { video.onended = () => res(); });
    cancelAnimationFrame(raf);
    rec.stop();
    await stopped;

    const ext = mime.startsWith("video/mp4") ? "mp4" : "webm";
    const base = file.name.replace(/\.\w+$/, "").replace(/[^\w.-]+/g, "-");
    const out = new File(chunks, `${base}-web.${ext}`, { type: mime.split(";")[0] });
    if (out.size < 10_000) throw new Error("Compression produced an empty file.");
    return out;
  } finally {
    cancelAnimationFrame(raf);
    video.src = "";
    URL.revokeObjectURL(url);
    if (ac) await ac.close().catch(() => {});
  }
}
