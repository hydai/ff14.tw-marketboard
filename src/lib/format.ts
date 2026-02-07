import type { PriceSummary, PriceSummaryD1, PriceSummaryKV } from "@/types/api";

// Format Gil amount with comma separator
export function formatGil(amount: number | null | undefined): string {
  if (amount == null) return "-";
  return Math.round(amount).toLocaleString("zh-TW");
}

// Format percentage with sign
export function formatPercent(value: number | null | undefined): string {
  if (value == null) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

// Relative time in Chinese (e.g., "3分鐘前", "2小時前")
export function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";

  const date = new Date(dateStr);
  const now = Date.now();
  const diff = now - date.getTime();

  if (diff < 0) return "剛剛";

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "剛剛";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分鐘前`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小時前`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;

  const months = Math.floor(days / 30);
  return `${months}個月前`;
}

// Normalize priceSummary from either KV (camelCase) or D1 (snake_case)
export function normalizePriceSummary(
  raw: PriceSummaryKV | PriceSummaryD1 | null | undefined,
): PriceSummary | null {
  if (!raw) return null;

  // Detect KV format by checking for camelCase field
  if ("minPriceNQ" in raw) {
    const kv = raw as PriceSummaryKV;
    return {
      minPriceNQ: kv.minPriceNQ,
      minPriceHQ: kv.minPriceHQ,
      avgPriceNQ: kv.avgPriceNQ,
      avgPriceHQ: kv.avgPriceHQ,
      listingCount: kv.listingCount,
      saleVelocityNQ: kv.saleVelocityNQ,
      saleVelocityHQ: kv.saleVelocityHQ,
      cheapestWorld: kv.cheapestWorld,
      lastUpdated: kv.lastUpdated,
    };
  }

  // D1 snake_case fallback
  const d1 = raw as PriceSummaryD1;
  return {
    minPriceNQ: d1.min_price_nq,
    minPriceHQ: d1.min_price_hq,
    avgPriceNQ: d1.avg_price_nq,
    avgPriceHQ: d1.avg_price_hq,
    listingCount: d1.listing_count,
    saleVelocityNQ: d1.sale_velocity_nq,
    saleVelocityHQ: d1.sale_velocity_hq,
    cheapestWorld: d1.cheapest_world_name,
    lastUpdated: d1.snapshot_time,
  };
}

// Get the timestamp from a price history point based on resolution
export function getHistoryTimestamp(
  point: Record<string, unknown>,
  resolution: "raw" | "hourly" | "daily",
): string {
  if (resolution === "hourly") return point["hour_timestamp"] as string;
  if (resolution === "daily") return point["day_timestamp"] as string;
  return point["snapshot_time"] as string;
}
