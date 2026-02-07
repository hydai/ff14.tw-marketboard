import { useQuery } from "@tanstack/react-query";
import { fetchItems, fetchItem } from "@/api/client";

export function useItems(params?: {
  search?: string;
  category?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => fetchItems(params),
    enabled: params?.search !== undefined ? params.search.length > 0 : true,
  });
}

export function useItem(itemId: number) {
  return useQuery({
    queryKey: ["item", itemId],
    queryFn: () => fetchItem(itemId),
    enabled: itemId > 0,
  });
}
