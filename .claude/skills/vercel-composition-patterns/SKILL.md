---
name: vercel-composition-patterns
description: React/Next.js component composition patterns for the App Router — server/client boundaries, children-as-slots, compound components, and data co-location. Use when structuring component trees, deciding where the client boundary goes, or refactoring tangled component hierarchies.
---

# Vercel Composition Patterns

Patterns for composing React components cleanly in the Next.js App Router, where
the server/client boundary is a first-class design concern.

## Pass Server Components as `children`

A Client Component can render Server Components passed as `children` or props.
This keeps the server-rendered subtree server-rendered even inside an
interactive shell.

```tsx
// Client shell with interactivity
'use client';
export function Tabs({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(0);
  return <div>{/* tab controls + */}{children}</div>;
}

// Server usage — ServerPanel stays on the server
<Tabs>
  <ServerPanel />
</Tabs>
```

Rule of thumb: **the client boundary is about where interactivity lives, not
where the subtree ends.** Wrap interactive chrome in a client component and pass
content through as `children`.

## Move the boundary down

Don't `'use client'` a page to enable one interactive widget. Extract the widget
into its own client component and keep the page a Server Component.

```
Page (server)
├── Header (server)
├── LikeButton (client)   ← only this is client
└── Article (server)
```

## Compound components for cohesive APIs

Group related parts under one namespace so usage reads declaratively.

```tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>...</Card.Body>
  <Card.Footer><Button>Save</Button></Card.Footer>
</Card>
```

Share state via context within the compound family; expose only the parts the
consumer composes.

## Slots over configuration props

Prefer accepting `ReactNode` slots (`header`, `actions`, `footer`) over a long
list of boolean/string config props. Slots are more flexible and avoid
prop explosion.

```tsx
<PageShell
  header={<Breadcrumbs />}
  actions={<NewButton />}
>
  {children}
</PageShell>
```

## Co-locate data with the component that needs it

In Server Components, fetch inside the component that renders the data rather
than threading props from the top. Next.js dedupes identical fetches, so
co-location is cheap and keeps components self-contained.

## Suspense boundaries as composition seams

Wrap slow Server Components in `<Suspense fallback={...}>` so the rest of the
tree streams immediately. Place boundaries at meaningful UI regions (a feed, a
sidebar) so each streams independently.

```tsx
<Layout>
  <Suspense fallback={<FeedSkeleton />}>
    <Feed />        {/* slow, streams in */}
  </Suspense>
  <Sidebar />       {/* renders instantly */}
</Layout>
```

## Anti-patterns

- A single giant component owning fetching, state, and presentation.
- `'use client'` near the root, forcing the whole tree client-side.
- Prop-drilling data five levels deep instead of co-locating the fetch.
- Importing a Client Component into a Server Component and expecting server
  rendering of its children — pass them as `children` instead.
