import { useQuery } from "@tanstack/react-query";
import {
  fetchArbitrage,
  fetchDeals,
  fetchTrending,
  fetchVelocity,
} from "@/api/client";
import type { TrendDirection, TrendPeriod } from "@/types/api";

const ANALYTICS_REFRESH = 2 * 60 * 1000; // 2 minutes

export function useArbitrage(params?: {
  minProfit?: number;
  minProfitPct?: number;
  category?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["arbitrage", params],
    queryFn: () => fetchArbitrage(params),
    refetchInterval: ANALYTICS_REFRESH,
  });
}

export function useDeals(params?: {
  maxPercentile?: number;
  category?: number;
  world?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["deals", params],
    queryFn: () => fetchDeals(params),
    refetchInterval: ANALYTICS_REFRESH,
  });
}

export function useTrending(params?: {
  direction?: TrendDirection;
  period?: TrendPeriod;
  category?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["trending", params],
    queryFn: () => fetchTrending(params),
    refetchInterval: ANALYTICS_REFRESH,
  });
}

export function useVelocity(params?: {
  category?: number;
  minSales?: number;
  days?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["velocity", params],
    queryFn: () => fetchVelocity(params),
    refetchInterval: ANALYTICS_REFRESH,
  });
}
