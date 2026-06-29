---
name: remotion-best-practices
description: Best practices for building Remotion video compositions in React — animation timing, performance, determinism, data flow, and audio. Use when writing or reviewing Remotion components, structuring a video project, or debugging flickering/non-deterministic renders.
---

# Remotion Best Practices

Remotion renders React frame-by-frame. The mental model: your component is a
pure function of the current frame. Treat it that way and renders are
deterministic and fast.

## Determinism (the golden rule)

Every frame must be reproducible from `frame` + `props` alone.

- **Never** call `Math.random()`, `Date.now()`, or `new Date()` in render. Use
  `random(seed)` from `remotion` for stable pseudo-randomness.
- **Never** read mutable external state or animate via `useEffect`/`setState`.
- Derive everything from `useCurrentFrame()` and `useVideoConfig()`.

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const Title: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = spring({ frame, fps, config: { damping: 200 } });

  return <h1 style={{ opacity, transform: `scale(${scale})` }}>{text}</h1>;
};
```

## Animation

- Prefer `spring()` for natural motion, `interpolate()` for precise linear ramps.
- Always set `extrapolateLeft`/`extrapolateRight: 'clamp'` unless you want
  values to keep extending past the range.
- Think in frames, but compute durations from `fps` so the project survives an
  fps change (`const oneSecond = fps`).
- Use `<Sequence from={x} durationInFrames={y}>` to time-shift and trim children;
  inside a Sequence, `useCurrentFrame()` is relative to the sequence start.

## Structure

- One composition = one scene/video. Register with `<Composition>` in the root.
- Make components small and prop-driven so they're previewable in isolation.
- Pass data via `inputProps` and validate with a Zod schema for type-safe props
  and the Remotion Studio props editor.
- Keep heavy data fetching out of render — fetch in `calculateMetadata` or pass
  pre-fetched data through props.

## Performance

- Use `<Img>`, `<Video>`, `<Audio>`, and `staticFile()` from `remotion` instead
  of raw tags so assets preload and the renderer waits for them.
- Wrap async asset readiness with `delayRender()` / `continueRender()` so frames
  don't render before data/fonts are ready.
- Avoid giant DOM trees per frame; memoize expensive computed values.
- Prefer transforms/opacity over layout-affecting properties for smooth motion.

## Audio & timing

- Add audio with `<Audio src={staticFile('music.mp3')} />`; trim with
  `startFrom`/`endAt`. Use `volume` as a function of frame to fade.
- Sync visuals to audio by computing beats/timestamps into frame numbers.

## Common mistakes

- Animating with CSS transitions/keyframes — they don't advance with the
  render clock. Drive all motion from `frame`.
- Forgetting `clamp`, causing values to overshoot off-screen.
- Using `useEffect` for animation state — it won't run deterministically per
  frame during rendering.
