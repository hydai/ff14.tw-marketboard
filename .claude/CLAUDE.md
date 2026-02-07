# FF14 陸行鳥 Market Board Dashboard

## Project Overview

React SPA dashboard for FF14 Taiwan datacenter (陸行鳥) market board data. Deployed on Cloudflare Pages at `marketboard.ff14.tw`. The backend API is a separate project at `../ff14.tw-marketboard-api/` deployed at `marketboard-api.ff14.tw`.

## Tech Stack

- React 19, TypeScript 5, Vite 6
- TailwindCSS 4 (CSS-first config via `@theme` in `src/app.css`, no `tailwind.config.js`)
- React Router 7, TanStack React Query 5, Recharts 2
- GitHub Pages (static SPA, deployed via GitHub Actions)

## Commands

```bash
npm run dev        # Vite dev server on :5173, proxies /api to marketboard-api.ff14.tw
npm run build      # tsc -b && vite build → dist/, copies 404.html for SPA routing
npm run preview    # Preview production build
npm run typecheck  # tsc --noEmit
```

## Architecture

### Directory Layout

- `src/types/api.ts` — All API response interfaces (snake_case from D1, camelCase from KV)
- `src/api/client.ts` — Typed `fetchApi<T>()` + per-endpoint wrappers, uses `VITE_API_BASE` env var
- `src/hooks/` — TanStack Query hooks: useItems, usePrices, useAnalytics (2min refresh), useStatus (30s refresh)
- `src/lib/format.ts` — `formatGil`, `formatPercent`, `formatRelativeTime`, `normalizePriceSummary`, `getHistoryTimestamp`
- `src/lib/constants.ts` — 8 worlds, city names zh-TW, period/direction options
- `src/components/layout/` — AppLayout (sidebar + outlet), Sidebar (7 nav links), PageShell (title + document.title)
- `src/components/ui/` — Card, DataTable, GilAmount, PriceChange, ItemLink, Badge, Skeleton, SearchInput, Pagination, Select
- `src/components/overview/` — SystemStatusCard, TrendingPreview, DealsPreview, ArbitragePreview, VelocityPreview
- `src/components/charts/` — PriceHistoryChart (Recharts LineChart), SalesChart (Recharts ScatterChart)
- `src/components/item/` — PriceSummaryCards, WorldPriceTable, ListingsTable
- `src/pages/` — 7 route pages, lazy-loaded via React.lazy() except OverviewPage

### Code Splitting

Non-landing routes use `React.lazy()` in `App.tsx`. Recharts is only bundled in the ItemDetailPage chunk (~113KB gzipped). Main bundle is ~89KB gzipped.

## Critical Patterns

### PriceSummary Dual Format

The `getItem` API returns `priceSummary` from either KV cache (camelCase `PriceSummaryKV`) or D1 fallback (snake_case `PriceSummaryD1`). Always use `normalizePriceSummary()` from `src/lib/format.ts` to get a consistent `PriceSummary` type.

### HQ Field

D1 returns `hq` as `number` (0 or 1), NOT boolean. Always compare with `=== 1`.

### Price History Time Column

Resolution determines which column holds the timestamp:
- `raw` → `snapshot_time`
- `hourly` → `hour_timestamp`
- `daily` → `day_timestamp`

Use `getHistoryTimestamp(point, resolution)` from `src/lib/format.ts`.

### API Base URL

- Dev: `VITE_API_BASE` is empty, Vite proxy handles `/api/*` → `https://marketboard-api.ff14.tw`
- Production: `VITE_API_BASE=https://marketboard-api.ff14.tw` set in `.env.production` (read by Vite at build time)

## Conventions

- All user-facing text is Traditional Chinese (zh-TW)
- Dark theme: zinc-950 background, zinc-900 cards, zinc-800 borders, gold-400/500 accents
- Gold color palette defined in `src/app.css` via `@theme` directive (gold-50 through gold-900)
- Path alias: `@/*` → `./src/*`
- Named exports for all components (no default exports except App)
- API response types in `src/types/api.ts` match snake_case D1 column names

## Deployment

GitHub Pages with GitHub Actions. Workflow at `.github/workflows/deploy.yml` builds and deploys on push to `master`.

- Custom domain: `marketboard.ff14.tw` (configured via `public/CNAME` and GitHub repo settings)
- DNS: CNAME record pointing `marketboard.ff14.tw` → `hydai.github.io`
- SPA routing: `dist/404.html` is a copy of `index.html` so direct URL access works with React Router
- Env vars: `VITE_API_BASE` set in `.env.production` (committed, not secret)
- `public/.nojekyll` skips Jekyll processing to avoid issues with `_`-prefixed asset files

## API Reference

Backend repo: `../ff14.tw-marketboard-api/`

Key reference files:
- `../ff14.tw-marketboard-api/src/utils/types.ts` — Canonical response interfaces
- `../ff14.tw-marketboard-api/src/api/router.ts` — All routes at `/api/v1`
- `../ff14.tw-marketboard-api/src/api/handlers/*.ts` — Response shapes per endpoint
- `../ff14.tw-marketboard-api/src/config/datacenters.ts` — 8 worlds data
- `../ff14.tw-marketboard-api/migrations/0001_initial_schema.sql` — DB schema
