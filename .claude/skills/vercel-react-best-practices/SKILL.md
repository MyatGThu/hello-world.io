---
name: vercel-react-best-practices
description: Best practices for React and Next.js apps deployed on Vercel — Server vs Client Components, data fetching, caching, rendering strategies, and performance. Use when building or reviewing Next.js (App Router) code, optimizing for Vercel, or deciding where code should run.
---

# Vercel React Best Practices

Guidance for Next.js (App Router) on Vercel. Default to the server; reach for
the client only when you need interactivity.

## Server vs Client Components

- Components are **Server Components by default**. Keep them server-side unless
  they need state, effects, browser APIs, or event handlers.
- Add `'use client'` only at the leaves that truly need interactivity. Push it
  as far down the tree as possible to keep bundles small.
- Server Components can be `async` and fetch data directly — no `useEffect`
  data fetching, no client waterfalls.
- Pass server data down as props; pass Server Components into Client Components
  as `children` to keep them server-rendered.

```tsx
// app/page.tsx — Server Component
async function Page() {
  const products = await getProducts(); // runs on the server
  return <ProductList products={products} />;
}
```

## Data fetching & caching

- Fetch where the data is used; React/Next dedupes identical `fetch` calls in a
  render pass.
- Control caching explicitly:
  ```ts
  fetch(url, { cache: 'force-cache' });          // static, cached
  fetch(url, { cache: 'no-store' });             // dynamic, per-request
  fetch(url, { next: { revalidate: 60 } });      // ISR: revalidate every 60s
  fetch(url, { next: { tags: ['products'] } });  // tag for on-demand revalidate
  ```
- Use `revalidateTag()` / `revalidatePath()` in Server Actions after mutations.
- Prefer `generateStaticParams` for known dynamic routes to pre-render at build.

## Rendering strategy

- **Static (SSG/ISR)** for content that's the same for everyone — fastest,
  cacheable at the edge.
- **Dynamic (SSR)** for per-request/personalized data.
- **Streaming** with `<Suspense>` and `loading.tsx` to show shell instantly and
  stream slow parts in. Wrap slow data in Suspense boundaries.

## Mutations with Server Actions

```tsx
async function createItem(formData: FormData) {
  'use server';
  await db.insert({ name: formData.get('name') });
  revalidateTag('items');
}
```

Use Server Actions for forms and mutations instead of hand-rolled API routes
where possible; they integrate with caching and progressive enhancement.

## Performance

- Use `next/image` for automatic sizing, lazy loading, and modern formats.
- Use `next/font` to self-host fonts and avoid layout shift (no FOUT/CLS).
- Dynamically `import()` heavy client-only components with `ssr: false` when
  appropriate.
- Keep client bundles lean: audit `'use client'` boundaries; avoid importing
  large libs into client components.
- Set `metadata` / `generateMetadata` for SEO and social cards.

## Common mistakes

- Marking a whole page `'use client'` because one button needs it.
- Fetching in `useEffect` when a Server Component could fetch directly.
- Forgetting to revalidate after a mutation, serving stale data.
- Importing server-only code (DB clients, secrets) into client components.
