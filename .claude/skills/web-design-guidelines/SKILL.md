---
name: web-design-guidelines
description: Reference guidelines for web design quality — typography, color, spacing, layout grids, accessibility, and motion. Use when establishing a design system, reviewing a UI for quality, or making consistent visual decisions across a web project.
---

# Web Design Guidelines

A reference checklist for consistent, accessible, professional web design. Use
it to set defaults and to audit existing work.

## Typography

- Establish a modular type scale (ratio 1.2–1.333). Limit to ~5 sizes.
- Body text 16–18px, line-height 1.5–1.6, measure 45–75 characters.
- Headings tighter line-height (1.1–1.25); use weight and size for hierarchy.
- Two typefaces maximum; system font stacks are a strong, fast default.
- Left-align body copy; avoid justified text on the web (uneven spacing).

## Color

- Build a neutral ramp (5–10 steps) plus one or two accent hues.
- Define semantic tokens: `fg`, `bg`, `muted`, `accent`, `success`, `danger`.
- Never pure black on pure white; soften to near-black on off-white.
- Verify contrast: 4.5:1 body text, 3:1 large text and UI components.
- Don't rely on color alone to convey meaning (add icons/text).
- Design dark mode as its own palette, not an inverted light theme.

## Spacing & layout

- Use a consistent base unit (4px or 8px). All spacing is a multiple of it.
- Adopt a responsive grid (commonly 12 columns) with a sensible gutter.
- Constrain line length and center content; generous whitespace reads premium.
- Group related elements with proximity; separate unrelated ones with space.
- Maintain a clear visual hierarchy: one primary action per view.

## Components

- Consistent corner radius, border weight, and shadow elevation across the UI.
- Define every state: default, hover, focus, active, disabled, loading, error.
- Buttons communicate priority (primary / secondary / ghost) — one primary per
  context.
- Forms: visible labels (not placeholder-only), inline validation, clear errors.

## Accessibility

- Semantic HTML; logical heading order (one `h1`, no skipped levels).
- Visible focus indicators; full keyboard operability.
- Touch targets ≥ 44×44px; adequate spacing between them.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- Provide text alternatives for non-text content.

## Motion

- Purposeful, fast (150–300ms), ease-out for entrances, ease-in for exits.
- Animate `transform` and `opacity` for performance; avoid animating layout.
- Use motion to show relationships and continuity, not decoration.

## Responsive

- Mobile-first. Test at 320px, 768px, 1024px, 1440px.
- Fluid type and spacing with `clamp()` where helpful.
- No horizontal scroll; images responsive (`srcset`/`sizes`).

## Quality audit (quick pass)

1. Is the spacing consistent and on the grid?
2. Is contrast sufficient everywhere?
3. Is there one clear primary action per view?
4. Are all interactive states defined?
5. Does it work keyboard-only and on a 320px screen?
