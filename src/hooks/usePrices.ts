import { useQuery } from "@tanstack/react-query";
import {
  fetchListings,
  fetchPriceHistory,
  fetchRecentSales,
} from "@/api/client";
import type { PricePeriod, PriceResolution } from "@/types/api";

export function useListings(itemId: number, hq?: boolean) {
  return useQuery({
    queryKey: ["listings", itemId, hq],
    queryFn: () => fetchListings(itemId, hq),
    enabled: itemId > 0,
  });
}

export function usePriceHistory(
  itemId: number,
  params?: { period?: PricePeriod; resolution?: PriceResolution },
) {
  return useQuery({
    queryKey: ["priceHistory", itemId, params],
    queryFn: () => fetchPriceHistory(itemId, params),
    enabled: itemId > 0,
  });
}

export function useRecentSales(
  itemId: number,
  params?: { days?: number; world?: string },
) {
  return useQuery({
    queryKey: ["recentSales", itemId, params],
    queryFn: () => fetchRecentSales(itemId, params),
    enabled: itemId > 0,
  });
}
