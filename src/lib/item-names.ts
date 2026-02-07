import allItems from "@/data/items.json";
import type { Item } from "@/types/api";

const nameMap = new Map<number, string>(
  (allItems as Item[]).map((item) => [item.item_id, item.name_zh]),
);

/** Look up the Traditional Chinese name for an item, falling back to the provided name. */
export function getItemNameZh(itemId: number, fallback: string): string {
  return nameMap.get(itemId) ?? fallback;
}
