import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchItem } from "@/api/client";
import allItems from "@/data/items.json";
import type { Item, PaginatedResponse } from "@/types/api";

const typedItems = allItems as Item[];

export function useItems(params?: {
  search?: string;
  category?: number;
  page?: number;
  limit?: number;
}) {
  const search = params?.search?.toLowerCase();
  const category = params?.category;
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  const data = useMemo<PaginatedResponse<Item>>(() => {
    let filtered = typedItems;

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name_zh.toLowerCase().includes(search) ||
          item.name_en.toLowerCase().includes(search),
      );
    }

    if (category !== undefined) {
      filtered = filtered.filter((item) => item.category_id === category);
    }

    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return { data: paged, total: filtered.length, page, limit };
  }, [search, category, page, limit]);

  return { data, isLoading: false };
}

export function useItem(itemId: number) {
  return useQuery({
    queryKey: ["item", itemId],
    queryFn: () => fetchItem(itemId),
    enabled: itemId > 0,
  });
}
