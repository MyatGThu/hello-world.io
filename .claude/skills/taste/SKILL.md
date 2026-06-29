---
name: taste
description: Aesthetic and design-judgment standard for making interfaces and visual work feel considered, restrained, and premium. Use when the user asks for something to "look better", "feel polished", have "good taste", or when making visual/typographic/layout decisions that need an opinionated eye.
---

# Taste

Taste is the ability to make a hundred small decisions consistently in one
direction. It is mostly about restraint and defaults.

## The default moves

- **Type first.** Most "design problems" are typography problems. Get a
  readable scale (e.g. 1.2–1.333 ratio), generous line-height (1.5 for body),
  and a comfortable measure (45–75 characters) before touching color.
- **Spacing on a system.** Use a 4px or 8px base unit. Inconsistent spacing
  reads as sloppy faster than almost anything else.
- **Less color, more contrast.** One accent color, a neutral ramp, and
  intentional contrast. Avoid pure black (#000) on pure white — soften to
  near-black on off-white.
- **Hierarchy through weight and size, not boxes.** Reach for borders and
  background fills last. Whitespace and type weight do most of the work.
- **Alignment is non-negotiable.** Everything lines up to a grid or an edge.
  Optical alignment beats mathematical alignment when they disagree.

## How to evaluate a design

Ask, in order:
1. Can I read it effortlessly? (legibility, contrast, measure)
2. Does my eye know where to go first? (hierarchy)
3. Does it feel calm or busy? (remove until it feels calm)
4. Is it consistent with itself? (spacing, radius, color repeated exactly)
5. Does anything feel arbitrary? (every value should trace to a system)

## Restraint rules

- Remove one element before adding one.
- If a border and shadow both work, use neither and try spacing.
- Animation should clarify, never decorate. 150–250ms, ease-out for entrances.
- Match radius across the whole UI — mixed corner radii look accidental.
- Two typefaces maximum. One is often better.

## Premium signals

Subtle, consistent shadows; crisp 1px hairlines; aligned baselines; tight but
breathable spacing; motion that respects `prefers-reduced-motion`; and content
that is never truncated awkwardly. Polish is the absence of small wrongness.
