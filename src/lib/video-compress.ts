// In-browser video compression for the admin back office.
//
// Supabase's plan caps uploads at ~50 MB, and most campaign videos are long
// 1080p files far over that. When staff pick an oversized video we re-encode
// it in the browser: decode through a hidden <video>, downscale onto a canvas
// (max 1280 wide), route audio through WebAudio, and record with MediaRecorder
// at a bitrate that lands the file near 44 MB.
//
// TWO BUGS THIS CODE EXISTS TO PREVENT (both hit production once):
//  1. DROPPED FRAMES → visible "skipping". requestAnimationFrame only fires
//     ~60x/s and is throttled hard when the tab is backgrounded, so a 24fps
//     source recorded ~10fps (1797 of 4411 frames). Fixed by driving capture
//     from requestVideoFrameCallback with a manual-frame stream
//     (captureStream(0) + track.requestFrame()), so exactly one captured frame
//     is emitted per decoded source frame.
//  2. OPUS AUDIO INSIDE AN MP4 → black screen on iPhone/Safari. Chromium's
//     MediaRecorder happily produces this invalid-for-Apple combination.
//     verifyCompatibility() detects it so we never silently ship a video that
//     is broken for half the donors.

const TARGET_MB = 44;
const AUDIO_BPS = 128_000;

export interface CompressResult {
  file: File;
  /** true when the output is a Safari/iOS-safe MP4 (H.264 + AAC) */
  appleSafe: boolean;
  mime: string;
  capturedFrames: number;
  expectedFrames: number;
}

export async function compressVideoInBrowser(
  file: File,
  onProgress?: (label: string) => void,
): Promise<CompressResult> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  let ac: AudioContext | null = null;
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
    const ctx = canvas.getContext("2d", { alpha: false })!;

    // captureStream(0) = frames are emitted ONLY when we call requestFrame(),
    // so the recording tracks the decoder instead of the display refresh rate.
    const stream = canvas.captureStream(0);
    const vTrack = stream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack;

    ac = new AudioContext();
    const srcNode = ac.createMediaElementSource(video);
    const dest = ac.createMediaStreamDestination();
    srcNode.connect(dest); // audio to the recording only, not the speakers
    dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));

    // Plain container mimes only: explicit avc1 codec strings pass
    // isTypeSupported in Chromium but record 0 bytes.
    const mime = ["video/mp4", 'video/webm;codecs="vp9,opus"', "video/webm"]
      .find(m => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m));
    if (!mime) throw new Error("This browser can't compress video.");

    const rec = new MediaRecorder(stream, {
      mimeType: mime,
      videoBitsPerSecond: videoBps,
      audioBitsPerSecond: AUDIO_BPS,
    });
    const chunks: Blob[] = [];
    rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    const stopped = new Promise<void>(res => { rec.onstop = () => res(); });

    const mins = Math.max(1, Math.ceil(duration / 60));
    let captured = 0;
    let finished = false;

    // Draw + emit exactly one frame per decoded source frame.
    type RVFC = HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number };
    const rvfcVideo = video as RVFC;
    const pump = () => {
      if (finished) return;
      ctx.drawImage(video, 0, 0, w, h);
      vTrack.requestFrame();
      captured++;
      onProgress?.(`Compressing… ${Math.min(99, Math.round((video.currentTime / duration) * 100))}% (~${mins} min — keep this tab open and in front)`);
      if (rvfcVideo.requestVideoFrameCallback) rvfcVideo.requestVideoFrameCallback(pump);
      else requestAnimationFrame(pump);
    };

    rec.start(1000);
    await video.play();
    pump();
    await new Promise<void>(res => { video.onended = () => res(); });
    finished = true;
    rec.stop();
    await stopped;

    const actualMime = rec.mimeType || mime;
    const ext = actualMime.startsWith("video/mp4") ? "mp4" : "webm";
    const base = file.name.replace(/\.\w+$/, "").replace(/[^\w.-]+/g, "-");
    const blob = new Blob(chunks, { type: actualMime.split(";")[0] });
    if (blob.size < 10_000) throw new Error("Compression produced an empty file.");

    // Verify the result actually decodes and kept its length.
    const outUrl = URL.createObjectURL(blob);
    const probe = document.createElement("video");
    probe.src = outUrl;
    const outDuration = await new Promise<number>(res => {
      probe.onloadedmetadata = () => res(probe.duration);
      probe.onerror = () => res(NaN);
      setTimeout(() => res(NaN), 8000);
    });
    URL.revokeObjectURL(outUrl);
    if (!isFinite(outDuration)) throw new Error("The compressed file would not play back — not uploading it.");

    const expectedFrames = Math.round(duration * 24);
    if (captured < expectedFrames * 0.7) {
      throw new Error(
        `Compression dropped too many frames (${captured} of about ${expectedFrames}), which causes skipping. ` +
        `This usually means the tab lost focus. Try again and keep this tab in front, or paste a Google Drive / YouTube link instead.`
      );
    }

    // H.264 + AAC in MP4 is the only combination every iPhone plays.
    const appleSafe = actualMime.startsWith("video/mp4") && !/opus/i.test(actualMime);

    return {
      file: new File([blob], `${base}-web.${ext}`, { type: blob.type }),
      appleSafe, mime: actualMime, capturedFrames: captured, expectedFrames,
    };
  } finally {
    video.pause();
    video.src = "";
    URL.revokeObjectURL(url);
    if (ac) await ac.close().catch(() => {});
  }
}

/** Shown when the browser can only make a file iPhones may not play. */
export const NOT_APPLE_SAFE_WARNING =
  "Heads-up: this browser could only produce a video format that may show as a BLACK SCREEN on iPhones.\n\n" +
  "Recommended instead: upload the video to Google Drive or YouTube (set sharing to \"Anyone with the link\") " +
  "and paste that link in the Video URL box — it plays on every phone and has no size limit.\n\n" +
  "Press OK to upload this compressed file anyway, or Cancel to use a link instead.";
