// ── Items (from D1 `items` table via SELECT *) ──

export interface Item {
  item_id: number;
  name_en: string;
  name_ja: string;
  name_zh: string;
  icon_path: string;
  category_id: number | null;
  category_name: string | null;
  is_hq_available: number; // 0 or 1
  stack_size: number;
  updated_at: string;
}

export interface ItemWithPrice extends Item {
  priceSummary: PriceSummaryKV | PriceSummaryD1 | null;
}

// KV-cached version (camelCase)
export interface PriceSummaryKV {
  itemId: number;
  minPriceNQ: number | null;
  minPriceHQ: number | null;
  avgPriceNQ: number | null;
  avgPriceHQ: number | null;
  listingCount: number;
  saleVelocityNQ: number;
  saleVelocityHQ: number;
  cheapestWorld: string | null;
  lastUpdated: string;
}

// D1 fallback (snake_case from price_snapshots via SELECT *)
export interface PriceSummaryD1 {
  id: number;
  item_id: number;
  snapshot_time: string;
  min_price_nq: number | null;
  min_price_hq: number | null;
  avg_price_nq: number | null;
  avg_price_hq: number | null;
  listing_count: number;
  units_for_sale: number;
  sale_velocity_nq: number;
  sale_velocity_hq: number;
  cheapest_world_id: number | null;
  cheapest_world_name: string | null;
}

// Normalized price summary for frontend use
export interface PriceSummary {
  minPriceNQ: number | null;
  minPriceHQ: number | null;
  avgPriceNQ: number | null;
  avgPriceHQ: number | null;
  listingCount: number;
  saleVelocityNQ: number;
  saleVelocityHQ: number;
  cheapestWorld: string | null;
  lastUpdated: string | null;
}

// ── Listings (from D1 `current_listings` via SELECT *) ──

export interface Listing {
  id: number;
  item_id: number;
  world_id: number;
  world_name: string;
  listing_id: string;
  price_per_unit: number;
  quantity: number;
  total: number;
  tax: number;
  hq: number; // 0 or 1
  retainer_name: string;
  retainer_city: number;
  creator_name: string;
  last_review_time: string | null;
  fetched_at: string;
}

// ── Price History ──

// Resolution determines which time column is present
export interface PriceHistoryRaw {
  id: number;
  item_id: number;
  snapshot_time: string;
  min_price_nq: number | null;
  min_price_hq: number | null;
  avg_price_nq: number | null;
  avg_price_hq: number | null;
  listing_count: number;
  units_for_sale: number;
  sale_velocity_nq: number;
  sale_velocity_hq: number;
  cheapest_world_id: number | null;
  cheapest_world_name: string | null;
}

export interface PriceHistoryHourly {
  id: number;
  item_id: number;
  hour_timestamp: string;
  min_price_nq: number | null;
  min_price_hq: number | null;
  avg_price_nq: number | null;
  avg_price_hq: number | null;
  max_price_nq: number | null;
  max_price_hq: number | null;
  total_listings: number;
  total_sales: number;
  total_sales_gil: number;
}

export interface PriceHistoryDaily {
  id: number;
  item_id: number;
  day_timestamp: string;
  min_price_nq: number | null;
  min_price_hq: number | null;
  avg_price_nq: number | null;
  avg_price_hq: number | null;
  max_price_nq: number | null;
  max_price_hq: number | null;
  total_listings: number;
  total_sales: number;
  total_sales_gil: number;
}

export type PriceHistoryPoint =
  | PriceHistoryRaw
  | PriceHistoryHourly
  | PriceHistoryDaily;

// ── Sales History (from D1 `sales_history` via SELECT *) ──

export interface SaleRecord {
  id: number;
  item_id: number;
  world_id: number;
  world_name: string;
  price_per_unit: number;
  quantity: number;
  total: number;
  hq: number; // 0 or 1
  buyer_name: string;
  sold_at: string;
  fetched_at: string;
}

// ── Analytics (SQL with aliases) ──

export interface ArbitrageItem {
  item_id: number;
  item_name: string;
  buy_world: string;
  buy_price: number;
  sell_world: string;
  sell_price: number;
  profit: number;
  profit_pct: number;
}

export interface DealItem {
  item_id: number;
  item_name: string;
  world_name: string;
  current_price: number;
  average_price: number;
  discount: number;
}

export interface TrendingItem {
  item_id: number;
  item_name: string;
  current_price: number;
  previous_price: number;
  change_pct: number;
}

export interface VelocityItem {
  item_id: number;
  item_name: string;
  sales_per_day: number;
  avg_price: number;
  total_gil_per_day: number;
}

// ── Tax Rates (from D1 `tax_rates` via SELECT *) ──

export interface TaxRate {
  world_id: number;
  world_name: string;
  limsa: number;
  gridania: number;
  uldah: number;
  ishgard: number;
  kugane: number;
  crystarium: number;
  sharlayan: number;
  tuliyollal: number;
  updated_at: string;
}

// ── Status / Worlds ──

export interface WorldInfo {
  id: number;
  name: string;
  nameEn: string;
}

export interface SystemStatus {
  status: string;
  datacenter: string;
  worlds: number;
  lastPollTime: string | null;
  taxRateCount: number;
}

// ── API Response Envelopes ──

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface DataResponse<T> {
  data: T;
}

export interface ListResponse<T> {
  data: T[];
}

export interface TrendingResponse {
  data: TrendingItem[];
  direction: "up" | "down";
  period: string;
}

export interface PriceHistoryResponse {
  data: PriceHistoryPoint[];
  period: string;
  resolution: "raw" | "hourly" | "daily";
}

export interface VelocityResponse {
  data: VelocityItem[];
  days: number;
}

export interface WorldsResponse {
  data: WorldInfo[];
  datacenter: string;
}

// ── Resolution/Period types ──

export type PriceResolution = "raw" | "hourly" | "daily";
export type PricePeriod = "1d" | "3d" | "7d" | "14d" | "30d" | "90d";
export type TrendDirection = "up" | "down";
export type TrendPeriod = "1d" | "3d" | "7d";
