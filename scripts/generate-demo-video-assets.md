# Demo Video Asset Generation (ffmpeg)

Use these commands locally to generate poster images and 8-second preview videos from full demo videos.

Assumptions:
- Input full videos are `vd1.webm`, `vd2.webm`, `vd3.webm`.
- You are running commands from the repository root.
- `ffmpeg` is installed and available in PATH.

## 1) Posters (extract frame around 1 second)

```bash
ffmpeg -ss 00:00:01 -i vd1.webm -frames:v 1 -q:v 2 poster-vd1.jpg
ffmpeg -ss 00:00:01 -i vd2.webm -frames:v 1 -q:v 2 poster-vd2.jpg
ffmpeg -ss 00:00:01 -i vd3.webm -frames:v 1 -q:v 2 poster-vd3.jpg
```

## 2) Preview videos (8 seconds, lighter bitrate/resolution)

```bash
ffmpeg -ss 00:00:00 -i vd1.webm -t 8 -vf "fps=24,scale='min(960,iw)':-2" -c:v libvpx-vp9 -b:v 1800k -an vd1_preview.webm
ffmpeg -ss 00:00:00 -i vd2.webm -t 8 -vf "fps=24,scale='min(960,iw)':-2" -c:v libvpx-vp9 -b:v 1800k -an vd2_preview.webm
ffmpeg -ss 00:00:00 -i vd3.webm -t 8 -vf "fps=24,scale='min(960,iw)':-2" -c:v libvpx-vp9 -b:v 1800k -an vd3_preview.webm
```

Notes:
- This target should usually land around ~3-10MB depending on source complexity.
- If still large, reduce `-b:v` to `1200k` and/or cap scale to 720 width.

## 3) Upload assets to GitHub Release

Upload these files to the same release tag used by CI (`v1.0` by default in `.github/workflows/gh-pages.yml`):

- `poster-vd1.jpg`
- `poster-vd2.jpg`
- `poster-vd3.jpg`
- `vd1_preview.webm`
- `vd2_preview.webm`
- `vd3_preview.webm`

Full videos (`vd1.webm`, `vd2.webm`, `vd3.webm`) stay as-is in the same release.
