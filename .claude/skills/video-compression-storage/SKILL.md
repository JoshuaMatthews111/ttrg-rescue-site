---
name: video-compression-storage
description: Ship long/large campaign videos on a site whose storage plan caps uploads (~50MB on Supabase free tier) — in-browser MediaRecorder compression in the admin, local ffmpeg compression for one-off files, and iframe embeds for Drive/YouTube/Vimeo links. Use when videos "won't upload", "only show a thumbnail and buffer", or a client needs staff-friendly video publishing.
---

# Video Compression & Storage — Big Videos on a Capped Plan

Production-proven on teamtrainersrescuegroup.com: 139MB/3-minute campaign videos playing
from Supabase storage on a plan that rejects anything over ~50MB.

## Step 0 — find the REAL limit empirically (never trust the dashboard)

Bucket config can say 5GB while the PLAN caps uploads at 50MB. Binary-search it:

```bash
dd if=/dev/zero of=test.bin bs=1m count=60
curl -X POST "$SUPABASE_URL/storage/v1/object/<bucket>/test.bin" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/octet-stream" --data-binary @test.bin
# 413 "Payload too large" → over the plan cap. Repeat at 45MB → 200 = cap ≈ 50MB.
# DELETE the test object afterward.
```

Set `MAX_UPLOAD_MB` a couple MB under the cap (e.g. 48).

## The three-path system

**Path A — direct upload** (file ≤ cap): upload as-is. Always set `contentType: file.type`.

**Path B — compress, then upload** (file > cap):
- *One-off / operator machine*: ffmpeg. Bitrate math: `total_bits = TARGET_MB*8*1024*1024`,
  `video_kbps = total_bits/duration/1000 - 128 (audio)`. For a 3-min video → ~1700k.
  ```bash
  ffmpeg -i in.mp4 -vf "scale=1280:720" -c:v libx264 -preset slow \
    -b:v 1700k -maxrate 2200k -bufsize 3400k -c:a aac -b:a 128k \
    -movflags +faststart out.mp4        # +faststart = instant seek/stream on the web
  ```
- *Built into the admin (staff self-serve)*: in-browser re-encode. Hidden `<video>` →
  draw frames to a canvas (downscale to max 1280w, even dimensions) → `canvas.captureStream(30)`
  → audio via `AudioContext.createMediaElementSource` → `createMediaStreamDestination`
  (connect source→dest ONLY; not to speakers) → add audio track to the canvas stream →
  `MediaRecorder` with `videoBitsPerSecond` from the same bitrate math (clamp 700k–3.5M).
  Runs in REAL TIME (3-min video ≈ 3-min wait): show live % progress and say so up front.

  **Hard-won gotcha**: `MediaRecorder.isTypeSupported('video/mp4;codecs="avc1..."')`
  returns true in Chromium but records **0 bytes**. Use plain container mimes, in this
  order: `"video/mp4"` → `'video/webm;codecs="vp9,opus"'` → `"video/webm"`. Verify the
  output blob is > 10KB and decodable before uploading.

**Path C — external host embed** (no upload at all): staff paste a share link; the site
renders the host's player in an `<iframe>`. A Drive/YouTube share URL inside a `<video>`
tag is THE classic "shows a thumbnail and buffers forever" bug — share pages are HTML,
not video files. Convert:
- Drive `file/d/<id>/view` or `?id=<id>` → `https://drive.google.com/file/d/<id>/preview`
- YouTube watch/shorts/live/youtu.be → `https://www.youtube.com/embed/<id>`
  (regex must catch `v=` anywhere in the query string, not just first param)
- Vimeo `/<id>` → `https://player.vimeo.com/video/<id>`
- Loom `share/<id>` → `loom.com/embed/<id>`; Streamable `/<id>` → `/e/<id>`
- Dropbox share links: rewrite host to `dl.dropboxusercontent.com` + `dl=0`→`raw=1`,
  then treat as a direct file for `<video>`.
Render rule: `getVideoEmbedUrl(url)` returns an embed URL → `<iframe allowfullscreen>`;
null → `<video src={getDirectVideoUrl(url)}>`.

## Admin UX rules

- Pre-check `file.size` BEFORE uploading. Over the cap → `confirm()` offering in-browser
  compression (state the wait time!), with Cancel falling back to "paste a Drive/YouTube
  link" guidance. Never let an upload fail silently.
- Show progress text in the upload button itself ("Compressing video… 42% (~3 min)").
- On any failure, alert with the two-option guidance (link or compress) — staff should
  always know their next move.

## Verification loop (run until every step passes)

1. **Probe** the source: `ffprobe -show_entries format=duration,bit_rate` — know duration,
   codec, dimensions before choosing bitrate.
2. **Compress** → check output size is under the cap with ≥3MB margin.
3. **Upload** → HTTP 200 and the public URL returns `content-type: video/*`.
4. **Point the site at it** (DB row / JSON blob) — fetch the store back and confirm the
   URL actually changed (CDN caches: always read with a `?t=` cache-buster).
5. **Play it as a visitor**: load the page, `video.play()`, then assert
   `readyState === 4 && !paused && currentTime > 0 && error === null` and duration
   matches the source. A thumbnail with a spinner = the URL is not a video file.
6. For the in-browser compressor, test the ACTUAL browser: record a short clip, assert
   the blob loads in a `<video>` (`onloadeddata` fires). This is how the avc1 0-byte
   bug was caught before staff ever hit it.

## When to recommend a plan upgrade instead

If the client uploads many videos weekly and wants full 1080p originals with zero wait,
a storage plan upgrade (e.g. Supabase Pro) lifts the cap into the GB range and every
path above keeps working unchanged. Compression + embeds are the $0 solution.
