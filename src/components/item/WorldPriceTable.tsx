import { useListings } from "@/hooks/usePrices";
import { GilAmount } from "@/components/ui/GilAmount";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Listing } from "@/types/api";

interface WorldPriceTableProps {
  itemId: number;
}

interface WorldSummary {
  world_name: string;
  minNQ: number | null;
  minHQ: number | null;
  count: number;
}

export function WorldPriceTable({ itemId }: WorldPriceTableProps) {
  const { data, isLoading } = useListings(itemId);

  if (isLoading) {
    return <Skeleton className="h-48" />;
  }

  const listings = data?.data ?? [];

  const worldMap = new Map<string, Listing[]>();
  for (const listing of listings) {
    const existing = worldMap.get(listing.world_name) ?? [];
    existing.push(listing);
    worldMap.set(listing.world_name, existing);
  }

  const worlds: WorldSummary[] = [];
  for (const [world_name, wListings] of worldMap) {
    const nqPrices = wListings.filter((l) => l.hq !== 1).map((l) => l.price_per_unit);
    const hqPrices = wListings.filter((l) => l.hq === 1).map((l) => l.price_per_unit);
    worlds.push({
      world_name,
      minNQ: nqPrices.length > 0 ? Math.min(...nqPrices) : null,
      minHQ: hqPrices.length > 0 ? Math.min(...hqPrices) : null,
      count: wListings.length,
    });
  }

  let cheapestNQ = Infinity;
  for (const w of worlds) {
    if (w.minNQ != null && w.minNQ < cheapestNQ) {
      cheapestNQ = w.minNQ;
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-obsidian-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-obsidian-800 bg-obsidian-900/50 text-xs uppercase tracking-wider text-obsidian-400">
          <tr>
            <th className="px-4 py-3">伺服器</th>
            <th className="px-4 py-3">最低NQ價</th>
            <th className="px-4 py-3">最低HQ價</th>
            <th className="px-4 py-3">上架數</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-obsidian-800">
          {worlds.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-obsidian-500">
                無資料
              </td>
            </tr>
          ) : (
            worlds.map((w) => {
              const isCheapest =
                w.minNQ != null && w.minNQ === cheapestNQ;
              return (
                <tr
                  key={w.world_name}
                  className={
                    isCheapest
                      ? "bg-gold-500/10"
                      : "bg-obsidian-900 transition-colors hover:bg-gold-500/[0.03]"
                  }
                >
                  <td
                    className={`px-4 py-3 font-medium ${isCheapest ? "text-gold-400" : "text-obsidian-200"}`}
                  >
                    {w.world_name}
                  </td>
                  <td className="px-4 py-3">
                    <GilAmount amount={w.minNQ} />
                  </td>
                  <td className="px-4 py-3">
                    <GilAmount amount={w.minHQ} />
                  </td>
                  <td className="px-4 py-3 font-mono text-obsidian-300">{w.count}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
