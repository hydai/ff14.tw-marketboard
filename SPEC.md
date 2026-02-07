# FF14 陸行鳥 Market Board Dashboard

## Context

The `ff14.tw-marketboard-api` project is a fully operational Cloudflare Worker backend providing real-time market board data for the FF14 Taiwan datacenter (陸行鳥). It has rich endpoints for items, prices, analytics (arbitrage, deals, trending, velocity), and system info — but no frontend to surface this data to players.

This plan creates a dashboard website at `ff14.tw-marketboard/` that traders and crafters can use to spot arbitrage opportunities, find deals, track price trends, and look up item prices across all 8 worlds.

## Decisions

- **Audience**: Traders/Crafters (analytics-first)
- **Landing page**: Market Overview (trending + deals + arbitrage at a glance)
- **Language**: Traditional Chinese only
- **Deployment**: Cloudflare Pages (static SPA)
- **Visual**: Dark theme, game-inspired
- **Charts**: Recharts
- **Data fetching**: TanStack Query

## Tech Stack

- React 19 + TypeScript 5
- Vite 6 + `@vitejs/plugin-react`
- TailwindCSS 4 + `@tailwindcss/vite`
- React Router 7
- TanStack React Query 5
- Recharts 2
- Cloudflare Pages (deployment)

## Pages

| Route | Name | API Endpoints Used |
|---|---|---|
| `/` | 市場總覽 | trending, deals, arbitrage, velocity, status |
| `/search` | 物品搜尋 | items |
| `/items/:itemId` | 物品詳情 | items/:id, prices/:id, prices/:id/history, prices/:id/sales |
| `/arbitrage` | 跨服套利 | arbitrage |
| `/deals` | 撿漏排行 | deals |
| `/trending` | 趨勢分析 | trending |
| `/tax-rates` | 稅率資訊 | tax-rates |

## Project Structure

```
ff14.tw-marketboard/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── wrangler.toml              # Cloudflare Pages config
├── public/
│   ├── _redirects             # SPA routing for Cloudflare Pages
│   └── _headers               # Cache headers
└── src/
    ├── main.tsx                # Entry point
    ├── App.tsx                 # Router + QueryClient setup
    ├── app.css                 # TailwindCSS + dark theme
    ├── types/
    │   └── api.ts              # All API response interfaces
    ├── api/
    │   └── client.ts           # Typed fetch wrappers per endpoint
    ├── hooks/
    │   ├── useItems.ts         # useItems, useItem
    │   ├── usePrices.ts        # useListings, usePriceHistory, useRecentSales
    │   ├── useAnalytics.ts     # useArbitrage, useDeals, useTrending, useVelocity
    │   └── useStatus.ts        # useWorlds, useTaxRates, useStatus
    ├── lib/
    │   ├── format.ts           # formatGil, formatPercent, formatRelativeTime
    │   ├── constants.ts        # World list, city names, period/direction options
    │   └── query-client.ts     # TanStack Query client config
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.tsx    # Sidebar + content area
    │   │   ├── Sidebar.tsx      # Nav links in zh-TW
    │   │   └── PageShell.tsx    # Page wrapper with title
    │   ├── ui/
    │   │   ├── Card.tsx
    │   │   ├── DataTable.tsx    # Generic typed table
    │   │   ├── GilAmount.tsx    # Gold-colored gil display
    │   │   ├── PriceChange.tsx  # Green/red % change
    │   │   ├── ItemLink.tsx     # Clickable item → detail page
    │   │   ├── SearchInput.tsx  # Debounced search
    │   │   ├── Select.tsx       # Dark dropdown
    │   │   ├── Pagination.tsx
    │   │   ├── Badge.tsx
    │   │   └── Skeleton.tsx     # Loading placeholder
    │   ├── overview/
    │   │   ├── SystemStatusCard.tsx
    │   │   ├── TrendingPreview.tsx
    │   │   ├── DealsPreview.tsx
    │   │   ├── ArbitragePreview.tsx
    │   │   └── VelocityPreview.tsx
    │   ├── charts/
    │   │   ├── PriceHistoryChart.tsx  # Recharts LineChart
    │   │   └── SalesChart.tsx         # Recharts ScatterChart
    │   └── item/
    │       ├── PriceSummaryCards.tsx
    │       ├── WorldPriceTable.tsx
    │       └── ListingsTable.tsx
    └── pages/
        ├── OverviewPage.tsx
        ├── SearchPage.tsx
        ├── ItemDetailPage.tsx
        ├── ArbitragePage.tsx
        ├── DealsPage.tsx
        ├── TrendingPage.tsx
        └── TaxRatesPage.tsx
```

## API Response Types (from source code analysis)

The frontend types must match the actual API responses. Key findings from reading handlers and DB schema:

**Important**: Handlers use `SELECT *` → D1 returns **snake_case** columns. KV-cached results may use the typed interfaces (camelCase). The frontend must handle the snake_case shapes that come directly from D1.

### Items (from `items` table via `SELECT *`)
```ts
interface Item {
  item_id: number; name_en: string; name_zh: string; icon_path: string;
  category_id: number | null; category_name: string | null;
  is_hq_available: number; stack_size: number;
}
```

### Listings (from `current_listings` via `SELECT *`)
```ts
interface Listing {
  item_id: number; world_id: number; world_name: string; listing_id: string;
  price_per_unit: number; quantity: number; total: number; tax: number;
  hq: number; retainer_name: string; retainer_city: number; last_review_time: string;
}
```

### Price History (from `price_snapshots`/`hourly_aggregates`/`daily_aggregates`)
- Time column varies: `snapshot_time` | `hour_timestamp` | `day_timestamp`
- Common: `item_id, min_price_nq, min_price_hq, avg_price_nq, avg_price_hq`

### Analytics (custom SQL with aliases)
- **Arbitrage**: `item_id, item_name, buy_world, buy_price, sell_world, sell_price, profit, profit_pct`
- **Deals**: `item_id, item_name, world_name, current_price, average_price, discount`
- **Trending**: `item_id, item_name, current_price, previous_price, change_pct` (+ `direction, period` in response envelope)
- **Velocity**: `item_id, item_name, sales_per_day, avg_price, total_gil_per_day` (+ `days` in response envelope)

### Status
```ts
{ status: string; datacenter: string; worlds: number; lastPollTime: string | null; taxRateCount: number }
```

### Tax Rates (from `tax_rates` via `SELECT *`)
```ts
{ world_id: number; world_name: string; limsa: number; gridania: number; uldah: number;
  ishgard: number; kugane: number; crystarium: number; sharlayan: number; tuliyollal: number; updated_at: string }
```

## Critical Source Files to Reference

| File | Purpose |
|---|---|
| `../ff14.tw-marketboard-api/src/utils/types.ts` | Canonical API response interfaces |
| `../ff14.tw-marketboard-api/src/api/router.ts` | All routes at `/api/v1` |
| `../ff14.tw-marketboard-api/src/api/handlers/*.ts` | Exact response shapes per endpoint |
| `../ff14.tw-marketboard-api/src/db/queries.ts` | SQL queries → column names |
| `../ff14.tw-marketboard-api/src/config/datacenters.ts` | 8 worlds data to duplicate client-side |
| `../ff14.tw-marketboard-api/migrations/0001_initial_schema.sql` | DB column names |

## Implementation Phases

### Phase 1: Project Scaffold + Layout Shell
**Goal**: App boots with dark theme, sidebar navigation works, placeholder pages render.

**Files**:
1. `package.json` — dependencies: react 19, react-dom, react-router 7, @tanstack/react-query 5, recharts 2; devDeps: typescript 5, vite 6, @vitejs/plugin-react, tailwindcss 4, @tailwindcss/vite
2. `tsconfig.json` — strict mode, `"@/*": ["./src/*"]` paths
3. `vite.config.ts` — react + tailwind plugins, proxy `/api` → `http://localhost:8787`
4. `index.html` — `<html lang="zh-TW" class="dark">`
5. `src/app.css` — `@import "tailwindcss"`, dark color palette (zinc base, amber/gold accents), CJK font stack
6. `src/lib/query-client.ts` — QueryClient with staleTime: 60s, refetchOnWindowFocus: true
7. `src/components/layout/Sidebar.tsx` — 7 nav links in zh-TW, "陸行鳥" datacenter badge, collapsible
8. `src/components/layout/PageShell.tsx` — page wrapper (title + children)
9. `src/components/layout/AppLayout.tsx` — sidebar + `<Outlet />`
10. `src/pages/OverviewPage.tsx` — placeholder
11. `src/App.tsx` — QueryClientProvider + BrowserRouter + routes
12. `src/main.tsx` — createRoot + render

**Verify**: `npm install && npm run dev` → dark page with working sidebar nav

### Phase 2: API Client + Types + Query Hooks
**Goal**: Typed API client connects to backend, all TanStack Query hooks defined.

**Files**:
1. `src/types/api.ts` — interfaces matching API responses (snake_case from D1)
2. `src/api/client.ts` — `fetchApi<T>(path, params?)` generic + typed methods per endpoint
3. `src/hooks/useItems.ts` — useItems, useItem
4. `src/hooks/usePrices.ts` — useListings, usePriceHistory, useRecentSales
5. `src/hooks/useAnalytics.ts` — useArbitrage, useDeals, useTrending, useVelocity (auto-refresh 2min)
6. `src/hooks/useStatus.ts` — useWorlds (staleTime: Infinity), useTaxRates, useStatus (30s refresh)
7. `src/lib/format.ts` — formatGil, formatPercent, formatRelativeTime (in Chinese)
8. `src/lib/constants.ts` — world list from datacenters.ts, city names zh-TW, period/direction options

**Verify**: `npm run typecheck` passes; Network tab shows API calls when hooks are used

### Phase 3: Overview Page (Landing)
**Goal**: Landing page with live data — trending, deals, arbitrage, velocity, system status.

**Files**:
1. `src/components/ui/Card.tsx` — dark card (bg-zinc-900)
2. `src/components/ui/DataTable.tsx` — generic typed table with loading skeleton
3. `src/components/ui/GilAmount.tsx` — gold-colored formatted amount
4. `src/components/ui/PriceChange.tsx` — green↑/red↓ percent badge
5. `src/components/ui/ItemLink.tsx` — clickable item → `/items/:itemId`
6. `src/components/ui/Badge.tsx` — variants: hq, profit, loss
7. `src/components/ui/Skeleton.tsx` — animated loading placeholder
8. `src/components/overview/SystemStatusCard.tsx` — status + last poll time
9. `src/components/overview/TrendingPreview.tsx` — top 10 trending (3d, up)
10. `src/components/overview/DealsPreview.tsx` — top 10 deals
11. `src/components/overview/ArbitragePreview.tsx` — top 8 arbitrage
12. `src/components/overview/VelocityPreview.tsx` — top 10 velocity
13. `src/pages/OverviewPage.tsx` — grid layout combining all preview cards

**Verify**: Navigate to `/` → 5 data sections render with API data; items are clickable

### Phase 4: Item Search + Item Detail
**Goal**: Search items, view full detail with price chart, cross-world comparison, sales history.

**Files**:
1. `src/components/ui/SearchInput.tsx` — debounced (300ms) dark input
2. `src/components/ui/Pagination.tsx` — 上一頁/下一頁
3. `src/components/ui/Select.tsx` — dark dropdown
4. `src/pages/SearchPage.tsx` — search + category filter + paginated results
5. `src/components/charts/PriceHistoryChart.tsx` — Recharts LineChart (NQ + HQ lines), period/resolution toggles
6. `src/components/charts/SalesChart.tsx` — Recharts ScatterChart (NQ amber, HQ cyan dots)
7. `src/components/item/PriceSummaryCards.tsx` — stat cards row (min/avg prices, velocity)
8. `src/components/item/WorldPriceTable.tsx` — min price per world, highlight cheapest
9. `src/components/item/ListingsTable.tsx` — full listings, sortable, HQ filter
10. `src/pages/ItemDetailPage.tsx` — header + summary + chart + listings + sales

**Verify**: Search "水晶" → results appear; click item → full detail with chart and cross-world prices

### Phase 5: Analytics Pages (Arbitrage + Deals + Trending)
**Goal**: All three analytics pages with filters and sorting.

**Files**:
1. `src/pages/ArbitragePage.tsx` — filter (minProfit, minProfitPct, category), table with buy/sell world + profit
2. `src/pages/DealsPage.tsx` — filter (maxPercentile, category, world), table with discount %
3. `src/pages/TrendingPage.tsx` — toggles (direction up/down, period 1d/3d/7d), table with change %

**Verify**: All 3 pages render, filters work, items link to detail page

### Phase 6: Tax Rates + Polish
**Goal**: Tax rates page complete, loading/error states polished.

**Files**:
1. `src/pages/TaxRatesPage.tsx` — grid: 8 worlds × 8 cities, color-coded rates
2. Error/empty state components for all pages
3. Document title per page (`useEffect` → `document.title`)

**Verify**: All 7 pages working end-to-end; error states show on API failure

### Phase 7: Deployment
**Goal**: Production build + Cloudflare Pages deployment.

**Files**:
1. `wrangler.toml` — `pages_build_output_dir = "dist"`
2. `public/_redirects` — `/* /index.html 200`
3. `public/_headers` — cache immutable for assets
4. `src/lib/env.ts` — API base URL (empty in dev, configurable in prod)
5. Lazy loading for non-landing routes via `React.lazy()`

**Verify**: `npm run build` succeeds; `npm run preview` works; direct URL to `/arbitrage` renders correctly

## Verification (End-to-End)

1. Start the API locally: `cd ../ff14.tw-marketboard-api && npx wrangler dev`
2. Start the dashboard: `cd ff14.tw-marketboard && npm run dev`
3. Verify the overview page loads with live data
4. Search for an item, navigate to its detail page
5. Check all analytics pages (arbitrage, deals, trending)
6. Check tax rates page
7. Test error handling: stop the API, verify error states appear
8. Run `npm run build` and `npm run preview` to verify production build
9. Run `npm run typecheck` to ensure no type errors
