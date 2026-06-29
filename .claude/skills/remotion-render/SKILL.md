---
name: remotion-render
description: Render Remotion compositions to video/image files via the CLI or the Node.js SSR API. Use when the user wants to export, render, or produce an MP4/WebM/GIF/PNG-sequence/still from a Remotion project, set up rendering in CI, or render programmatically on a server or Lambda.
---

# Remotion Render

Turn Remotion compositions into media files. Pick the path that matches the
context: CLI for local/manual, the SSR API for programmatic/server, Lambda for
scalable cloud rendering.

## CLI rendering

```bash
# Render a composition by id to MP4
npx remotion render src/index.ts MyComposition out/video.mp4

# Common flags
npx remotion render src/index.ts MyComp out/video.mp4 \
  --codec=h264 \
  --crf=18 \                 # quality, lower = better (h264: 1-51, ~18-23 typical)
  --concurrency=4 \          # parallel browser tabs
  --frames=0-120 \           # render a subset
  --props='{"title":"Hi"}'   # pass input props as JSON

# Stills and other formats
npx remotion still src/index.ts MyComp out/thumb.png --frame=30
npx remotion render src/index.ts MyComp out/anim.gif --codec=gif
npx remotion render src/index.ts MyComp out/clip.webm --codec=vp8
```

## Programmatic rendering (Node SSR)

```ts
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';

const serveUrl = await bundle({
  entryPoint: path.resolve('src/index.ts'),
});

const inputProps = { title: 'Hello' };

const composition = await selectComposition({
  serveUrl,
  id: 'MyComposition',
  inputProps,
});

await renderMedia({
  serveUrl,
  composition,
  codec: 'h264',
  outputLocation: 'out/video.mp4',
  inputProps,
  onProgress: ({ progress }) => {
    console.log(`${Math.round(progress * 100)}%`);
  },
});
```

## Key parameters

- **codec**: `h264` (default, compatible), `h265`, `vp8`/`vp9` (webm), `gif`, `prores`.
- **crf / videoBitrate**: quality vs size. Use `crf` for h264/h265, lower is better.
- **concurrency**: number of parallel renderers. Default is half the CPU cores.
- **inputProps**: data passed to the composition; must be JSON-serializable.
- **imageFormat**: `jpeg` (faster) or `png` (alpha) for intermediate frames.
- **scale**: render at a multiple of composition dimensions for hi-DPI output.

## Lambda (scalable cloud render)

```bash
npx remotion lambda functions deploy
npx remotion lambda sites create src/index.ts --site-name=my-video
npx remotion lambda render <serve-url> MyComp --codec=h264
```

Use Lambda when you need many renders in parallel or render-on-demand from a
web app. It splits frames across function invocations and stitches the result.

## Gotchas

- The composition `id` must match exactly what `<Composition id="...">` declares.
- Audio needs `<Audio>` inside the composition; the renderer muxes it in.
- For transparency, use `--codec=prores --prores-profile=4444` or a PNG sequence.
- Long renders in CI: cache the Chromium download and set `--concurrency` to the
  runner's core count.
- Always pass the same `inputProps` to `selectComposition` and `renderMedia`.
