# rcrt-template-dashboard

> Agent-facing guide. Read this before editing any file in this template.

## What This Template Does

An admin panel with sidebar navigation, data tables, and chart components. All data comes from RCRT breadcrumbs. Pre-built CRUD page patterns and layout components. Use for internal tools where users manage data: CRM, project trackers, HR systems, admin panels.

## Rules
- NEVER rewrite the data table — use DataTable from @possibl/rcrt-ui
- NEVER modify auth.tsx
- NEVER fetch data outside of RCRT breadcrumb queries — use RcrtClient.queryBreadcrumbs

## Pre-Built — Do Not Reimplement

| What | Import | Usage |
|---|---|---|
| DataTable | @possibl/rcrt-ui | `<DataTable columns={cols} data={rows} onRowClick={fn} />` |
| Chart | @possibl/rcrt-ui | `<Chart type="line" data={chartData} />` |
| MetricCard | @possibl/rcrt-ui | `<MetricCard title="Users" value={500} trend="up" />` |
| AppLayout | src/components/layout/AppLayout.tsx | Wraps all pages — do not recreate |
| useRcrt | src/hooks/useRcrt.ts | const { breadcrumbs, create, update } = useRcrt(tags) |
| RcrtClient | src/lib/api-client.ts | For direct API calls |

## File Structure

```
src/
  App.tsx                    ← CONFIG: add routes here
  pages/
    DashboardPage.tsx        ← TOUCH: main overview
    ListPage.tsx             ← TOUCH: list view pattern
    DetailPage.tsx           ← TOUCH: detail/edit view
  components/
    layout/                  ← LEAVE: AppLayout, Sidebar, nav
  hooks/
    useRcrt.ts               ← LEAVE: breadcrumb CRUD hook
  lib/
    api-client.ts            ← LEAVE: RcrtClient
    auth.tsx                 ← LEAVE: DO NOT MODIFY
```

## Data Connection Pattern

```tsx
import { useRcrt } from '../hooks/useRcrt';

export function ContactList() {
  const { breadcrumbs: contacts, isLoading, create } = useRcrt(['type:contact']);

  const handleCreate = async (data) => {
    await create({ name: data.name, tags: ['type:contact'], content: data });
  };

  return <DataTable columns={CONTACT_COLUMNS} data={contacts.map(c => c.content)} />;
}
```

## Adding a New Page

1. Create `src/pages/MyPage.tsx`
2. Add route in App.tsx
3. Add nav item in AppLayout sidebar config

## Common Patterns

### Pattern 1: List + detail navigation
ListPage shows DataTable. Clicking a row navigates to DetailPage with the breadcrumb ID in the URL.

### Pattern 2: Overview with metrics
DashboardPage shows MetricCard components querying aggregate counts, plus a Chart showing trends.

### Pattern 3: Inline edit
DataTable with editable cells that call `update(breadcrumb.id, { content: newData })` on change.
