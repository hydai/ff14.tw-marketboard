import type {
  ArbitrageItem,
  DealItem,
  ItemWithPrice,
  Item,
  Listing,
  ListResponse,
  PaginatedResponse,
  PriceHistoryResponse,
  PricePeriod,
  PriceResolution,
  SaleRecord,
  SystemStatus,
  TaxRate,
  TrendDirection,
  TrendingResponse,
  TrendPeriod,
  VelocityResponse,
  WorldsResponse,
  DataResponse,
} from "@/types/api";

const API_BASE = "/api/v1";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Items ──

export function fetchItems(params?: {
  search?: string;
  category?: number;
  page?: number;
  limit?: number;
}) {
  return fetchApi<PaginatedResponse<Item>>("/items", params);
}

export function fetchItem(itemId: number) {
  return fetchApi<DataResponse<ItemWithPrice>>(`/items/${itemId}`);
}

// ── Prices ──

export function fetchListings(itemId: number, hq?: boolean) {
  return fetchApi<ListResponse<Listing>>(`/prices/${itemId}`, {
    hq: hq !== undefined ? String(hq) : undefined,
  });
}

export function fetchWorldListings(
  itemId: number,
  worldName: string,
  hq?: boolean,
) {
  return fetchApi<ListResponse<Listing> & { world: string }>(
    `/prices/${itemId}/world/${encodeURIComponent(worldName)}`,
    { hq: hq !== undefined ? String(hq) : undefined },
  );
}

export function fetchPriceHistory(
  itemId: number,
  params?: { period?: PricePeriod; resolution?: PriceResolution },
) {
  return fetchApi<PriceHistoryResponse>(`/prices/${itemId}/history`, params);
}

export function fetchRecentSales(
  itemId: number,
  params?: { days?: number; world?: string },
) {
  return fetchApi<ListResponse<SaleRecord>>(`/prices/${itemId}/sales`, params);
}

// ── Analytics ──

export function fetchArbitrage(params?: {
  minProfit?: number;
  minProfitPct?: number;
  category?: number;
  limit?: number;
}) {
  return fetchApi<ListResponse<ArbitrageItem>>("/arbitrage", params);
}

export function fetchDeals(params?: {
  maxPercentile?: number;
  category?: number;
  world?: string;
  limit?: number;
}) {
  return fetchApi<ListResponse<DealItem>>("/deals", params);
}

export function fetchTrending(params?: {
  direction?: TrendDirection;
  period?: TrendPeriod;
  category?: number;
  limit?: number;
}) {
  return fetchApi<TrendingResponse>("/trending", params);
}

export function fetchVelocity(params?: {
  category?: number;
  minSales?: number;
  days?: number;
  limit?: number;
}) {
  return fetchApi<VelocityResponse>("/velocity", params);
}

// ── Status ──

export function fetchWorlds() {
  return fetchApi<WorldsResponse>("/worlds");
}

export function fetchTaxRates() {
  return fetchApi<ListResponse<TaxRate>>("/tax-rates");
}

export function fetchStatus() {
  return fetchApi<SystemStatus>("/status");
}
