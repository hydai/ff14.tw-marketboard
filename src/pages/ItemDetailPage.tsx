import { useParams } from "react-router";
import { PageShell } from "@/components/layout/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";
import { PriceSummaryCards } from "@/components/item/PriceSummaryCards";
import { PriceHistoryChart } from "@/components/charts/PriceHistoryChart";
import { SalesChart } from "@/components/charts/SalesChart";
import { WorldPriceTable } from "@/components/item/WorldPriceTable";
import { ListingsTable } from "@/components/item/ListingsTable";
import { useItem } from "@/hooks/useItems";
import { getItemNameZh } from "@/lib/item-names";

export function ItemDetailPage() {
  const { itemId: itemIdParam } = useParams<{ itemId: string }>();
  const itemId = Number(itemIdParam) || 0;

  const { data, isLoading } = useItem(itemId);
  const item = data?.data;

  if (isLoading) {
    return (
      <PageShell title="載入中...">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-20" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </PageShell>
    );
  }

  if (!item) {
    return (
      <PageShell title="找不到物品">
        <p className="text-obsidian-500">此物品不存在或已被移除。</p>
      </PageShell>
    );
  }

  return (
    <PageShell title={getItemNameZh(itemId, item.name_zh)}>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-obsidian-400">{item.name_en}</p>
        {item.category_name && (
          <span className="rounded bg-obsidian-800 px-2 py-0.5 text-xs text-obsidian-400">
            {item.category_name}
          </span>
        )}
        {item.is_hq_available === 1 && (
          <span className="rounded bg-crystal-900/50 px-2 py-0.5 text-xs text-crystal-400 ring-1 ring-crystal-400/20">
            HQ 可用
          </span>
        )}
      </div>

      <div className="animate-reveal d1">
        <PriceSummaryCards itemId={itemId} />
      </div>

      <div className="animate-reveal d2 grid gap-4 lg:grid-cols-2">
        <PriceHistoryChart itemId={itemId} />
        <SalesChart itemId={itemId} />
      </div>

      <div className="animate-reveal d3">
        <h2 className="mb-3 font-heading text-lg font-semibold text-obsidian-100">跨服價格比較</h2>
        <WorldPriceTable itemId={itemId} />
      </div>

      <div className="animate-reveal d4">
        <h2 className="mb-3 font-heading text-lg font-semibold text-obsidian-100">所有上架</h2>
        <ListingsTable itemId={itemId} />
      </div>
    </PageShell>
  );
}
