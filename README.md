# FF14 陸行鳥 Market Board Dashboard

A React SPA dashboard for Final Fantasy XIV Taiwan datacenter (陸行鳥) market data. Built for traders and crafters to spot arbitrage opportunities, find deals, track price trends, and look up item prices across all 8 worlds.

**Live**: [marketboard.ff14.tw](https://marketboard.ff14.tw)
**API**: [marketboard-api.ff14.tw](https://marketboard-api.ff14.tw) ([source](https://github.com/hydai/ff14.tw-marketboard-api))

## Pages

| Route | Name | Description |
|---|---|---|
| `/` | 市場總覽 | Overview with trending, deals, arbitrage, velocity, system status |
| `/search` | 物品搜尋 | Item search with category filter and pagination |
| `/items/:itemId` | 物品詳情 | Price history charts, cross-world comparison, listings |
| `/arbitrage` | 跨服套利 | Cross-world arbitrage opportunities with profit filters |
| `/deals` | 撿漏排行 | Items priced below average with discount percentage |
| `/trending` | 趨勢分析 | Price trend analysis with direction/period toggles |
| `/tax-rates` | 稅率資訊 | Tax rates grid for 8 worlds x 8 cities |

## Tech Stack

- **React 19** + TypeScript 5
- **Vite 6** + `@vitejs/plugin-react`
- **TailwindCSS 4** (CSS-first config, dark theme with gold accents)
- **React Router 7**
- **TanStack React Query 5** (auto-refresh: 30s status, 2min analytics)
- **Recharts 2** (price history LineChart, sales ScatterChart)
- **GitHub Pages** (deployment via GitHub Actions)

## Development

```bash
# Install dependencies
npm install

# Start dev server (proxies API to marketboard-api.ff14.tw)
npm run dev

# Type check
npm run typecheck

# Production build
npm run build

# Preview production build
npm run preview
```

The Vite dev server runs on `http://localhost:5173/` and proxies `/api/*` requests to `https://marketboard-api.ff14.tw`.

## Deployment

Deployed on **GitHub Pages** via GitHub Actions. Every push to `master` triggers the workflow at `.github/workflows/deploy.yml`.

- Custom domain: `marketboard.ff14.tw` (via `public/CNAME`)
- SPA routing: `404.html` copy of `index.html` for client-side routing
- Env vars: `VITE_API_BASE` set in `.env.production`

| Variable | Dev (default) | Production |
|---|---|---|
| `VITE_API_BASE` | `""` (empty, uses Vite proxy) | `https://marketboard-api.ff14.tw` |

## Project Structure

```
src/
├── api/client.ts            # Typed fetch wrappers for all API endpoints
├── types/api.ts             # All API response interfaces
├── hooks/                   # TanStack Query hooks
│   ├── useItems.ts          # useItems, useItem
│   ├── usePrices.ts         # useListings, usePriceHistory, useRecentSales
│   ├── useAnalytics.ts      # useArbitrage, useDeals, useTrending, useVelocity
│   └── useStatus.ts         # useWorlds, useTaxRates, useStatus
├── lib/
│   ├── constants.ts         # 8 worlds, city names, period/direction options
│   ├── format.ts            # formatGil, formatPercent, formatRelativeTime
│   ├── env.ts               # VITE_API_BASE config
│   └── query-client.ts      # TanStack Query client config
├── components/
│   ├── layout/              # AppLayout, Sidebar, PageShell
│   ├── ui/                  # Card, DataTable, GilAmount, Badge, Skeleton, etc.
│   ├── overview/            # SystemStatus, Trending/Deals/Arbitrage/Velocity previews
│   ├── charts/              # PriceHistoryChart, SalesChart (Recharts)
│   └── item/                # PriceSummaryCards, WorldPriceTable, ListingsTable
├── pages/                   # 7 route pages
├── App.tsx                  # Router + QueryClient + React.lazy() code splitting
└── main.tsx                 # Entry point
```

## API Notes

The backend API (`ff14.tw-marketboard-api`) uses Cloudflare D1 (SQLite) and KV cache. Key frontend considerations:

- **PriceSummary dual format**: The `getItem` endpoint returns `priceSummary` from KV (camelCase) or D1 fallback (snake_case). The frontend normalizes both via `normalizePriceSummary()` in `src/lib/format.ts`.
- **HQ field**: D1 returns `hq` as `number` (0 or 1), not boolean. Compare with `=== 1`.
- **Price history timestamps**: Column name varies by resolution — `snapshot_time` (raw), `hour_timestamp` (hourly), `day_timestamp` (daily). Use `getHistoryTimestamp()`.
- **Analytics responses**: SQL aliases produce mixed naming (e.g., `item_name`, `buy_world`, `profit_pct`).

## Worlds (陸行鳥 Datacenter)

| ID | Name | English |
|---|---|---|
| 4028 | 伊弗利特 | Ifrit |
| 4029 | 迦樓羅 | Garuda |
| 4030 | 利維坦 | Leviathan |
| 4031 | 鳳凰 | Phoenix |
| 4032 | 奧汀 | Odin |
| 4033 | 巴哈姆特 | Bahamut |
| 4034 | 拉姆 | Ramuh |
| 4035 | 泰坦 | Titan |
