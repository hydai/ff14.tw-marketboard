import { useItem } from "@/hooks/useItems";
import { GilAmount } from "@/components/ui/GilAmount";
import { normalizePriceSummary } from "@/lib/format";
import { Skeleton } from "@/components/ui/Skeleton";

interface PriceSummaryCardsProps {
  itemId: number;
}

export function PriceSummaryCards({ itemId }: PriceSummaryCardsProps) {
  const { data, isLoading } = useItem(itemId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  const item = data?.data;
  const summary = normalizePriceSummary(item?.priceSummary ?? null);

  const cards = [
    { label: "最低NQ價", value: summary?.minPriceNQ ?? null },
    { label: "最低HQ價", value: summary?.minPriceHQ ?? null },
    { label: "中位NQ價", value: summary?.avgPriceNQ ?? null },
    { label: "中位HQ價", value: summary?.avgPriceHQ ?? null },
    { label: "上架數", value: summary?.listingCount ?? null, raw: true },
    { label: "最便宜伺服器", value: null, text: summary?.cheapestWorld ?? "-" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="animate-reveal rounded-lg border border-obsidian-800 bg-obsidian-900/80 p-4 backdrop-blur-sm"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <p className="text-xs uppercase tracking-wider text-obsidian-400">{card.label}</p>
          {card.text ? (
            <p className="mt-1 font-mono text-lg font-bold text-gold-400">{card.text}</p>
          ) : card.raw ? (
            <p className="mt-1 font-mono text-lg font-bold text-obsidian-100">
              {card.value != null ? card.value.toLocaleString("zh-TW") : "-"}
            </p>
          ) : (
            <p className="mt-1 text-lg font-bold">
              <GilAmount amount={card.value} />
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
