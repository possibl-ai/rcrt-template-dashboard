# RCRT Template: Dashboard

Admin dashboard with sidebar navigation, stat cards, and a sortable data table. Use this template for internal tools, CRM interfaces, or project management dashboards.

## What's Included

- React 18 + Vite + TypeScript + Tailwind CSS
- `@rcrt/api` client pre-configured
- Firebase authentication (Google sign-in)
- Wide sidebar layout (w-64) with icon-based navigation
- Dashboard page with stat cards + recent activity
- Data page with sortable table + tag filtering + "New" button
- Settings page with sign-out
- Dockerfile + Cloud Build config for Cloud Run deploy

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your RCRT API URL and Firebase config

# Start dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your RCRT API Gateway URL |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_RCRT_PREVIEW_TOKEN` | Preview token (for WebContainer preview) |

## Project Structure

```
src/
  App.tsx                    — Routing + auth wrapper
  main.tsx                   — Entry point
  index.css                  — Tailwind + design tokens
  pages/
    DashboardPage.tsx        — Stats cards + recent activity
    DataPage.tsx             — Sortable data table
    SettingsPage.tsx         — Account settings
  components/
    layout/
      AppLayout.tsx          — Sidebar + bottom nav shell
  lib/
    api-client.ts            — RcrtClient singleton
    auth.tsx                 — Firebase auth gate
    store.ts                 — Zustand state
    utils.ts                 — cn() helper
```

## Customizing

- **Add a page**: Create `src/pages/MyPage.tsx` → add Route in `App.tsx` → add nav item in `AppLayout.tsx`
- **Change theme**: Edit CSS variables in `src/index.css`
- **Data sources**: The data table queries breadcrumbs. Filter by tags, or add custom query parameters.
- **Stat cards**: Edit `DashboardPage.tsx` to change which tags map to which stats.

## Deploy

Push to main triggers Cloud Build → Cloud Run (if `cloudbuild.yaml` is configured).

## Built with RCRT

This template is designed for [RCRT Code Studio](https://github.com/possibl-ai/rcrt-v2). RCRT is the backend — all state lives in breadcrumbs, all AI runs through agents, all external APIs connect through services.
