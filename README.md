# Skills

A collection of Claude Code [skills](https://docs.claude.com/en/docs/claude-code/skills).
Each lives in `.claude/skills/<name>/SKILL.md` and is invoked when its
description matches the task at hand.

## Available skills

| Skill | Purpose |
| --- | --- |
| `impeccable` | Engineering craftsmanship standard for production-grade code. |
| `taste` | Aesthetic and design-judgment standard for polished, restrained UI. |
| `remotion-render` | Render Remotion compositions to video/image via CLI or SSR API. |
| `remotion-best-practices` | Building deterministic, performant Remotion compositions. |
| `frontend-design` | Designing and building accessible, responsive frontend UI. |
| `vercel-react-best-practices` | React/Next.js App Router best practices on Vercel. |
| `vercel-composition-patterns` | Component composition patterns for the App Router. |
| `web-design-guidelines` | Reference guidelines for typography, color, spacing, a11y. |
| `social-content` | Platform-native social media content creation. |
| `content-strategy` | Planning content programs: pillars, calendars, funnels. |

## Usage

In a Claude Code session, these skills are picked up automatically from the
`.claude/skills/` directory. You can invoke one explicitly by name (e.g.
`/impeccable`) or let Claude select the relevant skill based on your request.
