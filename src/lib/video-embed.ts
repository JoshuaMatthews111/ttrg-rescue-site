// Turns pasted video links into embeddable player URLs.
//
// Supabase's plan-level upload cap is 50 MB, so long/high-res videos can't be
// uploaded directly. Staff paste a Google Drive / YouTube / Vimeo link
// instead — those hosts stream any size for free, but their share URLs are
// web pages, not video files, so a <video> tag shows a poster and buffers
// forever. Render these through an <iframe> with the host's embed player.

export function getVideoEmbedUrl(url: string | undefined | null): string | null {
  if (!url) return null;

  // Google Drive: /file/d/<id>/view or ?id=<id> → /file/d/<id>/preview
  const drive = url.match(/drive\.google\.com\/(?:file\/d\/([\w-]+)|.*[?&]id=([\w-]+))/);
  if (drive) return `https://drive.google.com/file/d/${drive[1] || drive[2]}/preview`;

  // YouTube: watch?v=, youtu.be/, shorts/
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null; // direct file (mp4/mov/webm…) — play with a <video> tag
}

/** Max direct-upload size on the current Supabase plan (tested: 45 MB ok, 60 MB rejected). */
export const MAX_UPLOAD_MB = 48;

export const VIDEO_TOO_BIG_MESSAGE =
  `This video is over the ${MAX_UPLOAD_MB} MB direct-upload limit.\n\n` +
  `Two easy options:\n` +
  `1) Upload the video to Google Drive or YouTube (unlisted is fine), set sharing to "Anyone with the link", and paste the link in the Video URL box — it will play right on the site.\n` +
  `2) Compress the video first (720p is plenty for web) and upload the smaller file here.`;
