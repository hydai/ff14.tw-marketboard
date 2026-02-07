import { useQuery } from "@tanstack/react-query";
import { fetchWorlds, fetchTaxRates, fetchStatus } from "@/api/client";

export function useWorlds() {
  return useQuery({
    queryKey: ["worlds"],
    queryFn: fetchWorlds,
    staleTime: Infinity,
  });
}

export function useTaxRates() {
  return useQuery({
    queryKey: ["taxRates"],
    queryFn: fetchTaxRates,
  });
}

export function useStatus() {
  return useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
    refetchInterval: 30_000,
  });
}
