# rcrt-template-dashboard — Code Studio React app template (GitHub repo, standalone deploy)

> Guide for AI coding agents working in this repo. Generated from the
> code-studio knowledge base — matches the actual source in this template.

## What This Template Does

An internal tool / admin panel: sidebar layout, a DashboardPage of stat cards
computed from breadcrumb tags (e.g. `status:active`), and a DataPage table
with tag filter + client-side sorting. Use for CRMs, trackers, ops tools.

## Actual File Structure (verified against the repo)

```
src/
  App.tsx                          routes: / → DashboardPage, /data, /settings
  pages/
    DashboardPage.tsx              stat cards from queryBreadcrumbs([], 50) + tag counts
    DataPage.tsx                   table: tag filter, sort, "New" button (createBreadcrumb)
    SettingsPage.tsx
  components/layout/AppLayout.tsx
  lib/ (api-client, auth, rcrt-api, store, utils)
```

There is NO `useRcrt` hook, NO DataTable component, NO chart library
installed. Tables/cards are plain Tailwind JSX — copy DataPage's structure
for new entity tables.

## The RCRT client (vendored — NOT an npm package)

Every template vendors its client at `src/lib/rcrt-api.ts` and exposes a
singleton via `src/lib/api-client.ts`:

```ts
import { getClient } from '../lib/api-client';
const client = getClient();
```

Real method signatures (use these EXACTLY — `queryBreadcrumbs` takes
positional args, not an options object):

```ts
queryBreadcrumbs(tags: string[], limit = 100): Promise<Breadcrumb[]>
createBreadcrumb({ name?, title?, tags?, content?, upsert? }): Promise<Breadcrumb>
getBreadcrumb(id): Promise<Breadcrumb>
updateBreadcrumb(id, { title?, content?, tags?, version }): Promise<Breadcrumb>  // version REQUIRED
deleteBreadcrumb(id): Promise<void>
sendChat(message, sessionId?): Promise<{ id, session_id }>   // reply arrives via SSE, not the response
getSessions(limit = 30) / getSessionMessages(sessionId, limit = 100)
uploadFile(file) / getFileDownloadUrl(fileId) / getFileText(fileId)
connectEvents(onEvent): () => void   // SSE: onEvent({ type: 'breadcrumb', data }) — returns disconnect fn
resolveService(name)
```

Realtime pattern (the ONLY supported way — never hand-roll EventSource):

```tsx
useEffect(() => {
  const disconnect = getClient().connectEvents(({ type, data }) => {
    if (type !== 'breadcrumb') return;
    const event = data as any;
    const tags: string[] = event.tags || [];
    // filter by your tags, e.g. tags.includes(`session:${sessionId}`)
  });
  return disconnect;
}, [deps]);
```

DO NOT import `@possibl/rcrt-api` or `@possibl/rcrt-ui` — they are NOT in
package.json. Use the vendored client and build UI with Tailwind + lucide-react.

## Hard rules

- `npm run build` runs `tsc && vite build` — your code MUST typecheck or the
  Cloud Run deploy fails. No `any`-typed imports of nonexistent modules.
- NEVER modify `src/lib/rcrt-api.ts`, `src/lib/api-client.ts`, or
  `src/lib/auth.tsx` — auth + client are correct out of the box.
- NEVER add a database, REST API layer, or custom auth. Data is breadcrumbs.
- New deps: edit package.json only when truly needed; prefer what's installed
  (react-router-dom v7, zustand, lucide-react, tailwind, clsx/tailwind-merge via `cn()`).

## Adding a page

1. Create `src/pages/MyPage.tsx` (default export).
2. Add `<Route path="/my-page" element={<MyPage />} />` inside the layout route in `src/App.tsx`.
3. Add a nav item in `src/components/layout/AppLayout.tsx`.

## Env (.env — injected automatically by `project init-repo` and the preview)

`VITE_API_URL`, `VITE_TENANT_ID`, `VITE_RCRT_PREVIEW_TOKEN` (preview auth),
optional `VITE_FIREBASE_API_KEY` / `VITE_FIREBASE_AUTH_DOMAIN` /
`VITE_FIREBASE_PROJECT_ID` (production auth). `src/lib/auth.tsx` picks
Firebase when `VITE_FIREBASE_API_KEY` is set, else falls back to the preview
token. Styling: Tailwind design tokens in `src/index.css` (`--primary`,
`--background`, ...) — change theme there.

## Common patterns

- **Entity table**: copy DataPage, change the tags
  (`queryBreadcrumbs(['type:contact'], 100)`), render your fields from
  `item.content`.
- **Stats**: derive counts client-side from tags like `status:*` (see
  DashboardPage).
- **Charts**: nothing installed — either render simple bars with divs or add
  `recharts` to package.json deliberately.
