---
name: frontend-design
description: Practical guidance for designing and building high-quality frontend UI — layout, responsive behavior, component structure, accessibility, and interaction. Use when implementing UI from scratch, translating a design into code, or improving the look and feel of a web interface.
---

# Frontend Design

Bridges design intent and working UI code. Aim for interfaces that are
accessible, responsive, consistent, and pleasant to use.

## Layout

- Build mobile-first; add complexity at larger breakpoints, not the reverse.
- Use CSS Grid for two-dimensional page layout, Flexbox for one-dimensional
  rows/columns. Reach for `gap` instead of margins between siblings.
- Constrain content width with a max-width container (`~65ch` for text,
  `~1200px` for app shells) and center it.
- Respect safe areas and avoid fixed heights that break on small screens.

## Design tokens

Centralize and reuse. Never hardcode one-off values.

```css
:root {
  --space-1: 4px;  --space-2: 8px;  --space-3: 16px;  --space-4: 24px;
  --radius: 8px;
  --color-fg: #1a1a1a;  --color-bg: #ffffff;  --color-accent: #2563eb;
  --font-sans: ui-sans-serif, system-ui, sans-serif;
}
```

## Components

- One responsibility per component; lift shared state up, pass data down.
- Make components controlled where the parent needs the value; otherwise keep
  state local.
- Expose a small, predictable prop API. Provide sensible defaults.
- Compose small primitives (`Stack`, `Button`, `Card`) rather than building
  monoliths.

## Accessibility (non-negotiable)

- Semantic HTML first: `<button>`, `<nav>`, `<main>`, `<label>` — not `<div>`s
  with click handlers.
- Every interactive element is keyboard-reachable and has a visible focus ring.
- Images have `alt`; form inputs have associated `<label>`s.
- Maintain 4.5:1 contrast for body text, 3:1 for large text and UI controls.
- Respect `prefers-reduced-motion`; provide non-color cues for state.
- Use ARIA only to fill gaps semantic HTML can't — never as a substitute.

## Interaction & feedback

- Every action gives feedback: hover, active, loading, success, error states.
- Show skeletons or spinners for async; never leave a dead frame.
- Disable + label buttons during submission to prevent double-submits.
- Keep transitions 150–250ms with ease-out; animate transform/opacity only.

## Responsive checklist

- [ ] Works from 320px to ultra-wide without horizontal scroll.
- [ ] Touch targets ≥ 44×44px.
- [ ] Text reflows; nothing is clipped or overlapped.
- [ ] Images use `srcset`/`sizes` or are responsibly sized.
- [ ] Tested with keyboard only and with a screen reader pass.
