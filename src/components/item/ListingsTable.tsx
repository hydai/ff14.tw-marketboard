import { useState, useMemo } from "react";
import { useListings } from "@/hooks/usePrices";
import { GilAmount } from "@/components/ui/GilAmount";
import { Skeleton } from "@/components/ui/Skeleton";

interface ListingsTableProps {
  itemId: number;
}

export function ListingsTable({ itemId }: ListingsTableProps) {
  const [hqOnly, setHqOnly] = useState(false);
  const { data, isLoading } = useListings(itemId);

  const listings = useMemo(() => {
    const raw = data?.data ?? [];
    const filtered = hqOnly ? raw.filter((l) => l.hq === 1) : raw;
    return [...filtered].sort((a, b) => a.price_per_unit - b.price_per_unit);
  }, [data, hqOnly]);

  if (isLoading) {
    return <Skeleton className="h-64" />;
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={hqOnly}
            onChange={(e) => setHqOnly(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-800 text-gold-500 focus:ring-gold-500"
          />
          僅顯示 HQ
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/50 text-xs uppercase text-zinc-400">
            <tr>
              <th className="px-4 py-3">伺服器</th>
              <th className="px-4 py-3">價格</th>
              <th className="px-4 py-3">數量</th>
              <th className="px-4 py-3">總價</th>
              <th className="px-4 py-3">HQ</th>
              <th className="px-4 py-3">雇員</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {listings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  無上架資料
                </td>
              </tr>
            ) : (
              listings.map((l) => (
                <tr
                  key={l.id}
                  className="bg-zinc-900 transition-colors hover:bg-zinc-800"
                >
                  <td className="px-4 py-3 text-zinc-200">{l.world_name}</td>
                  <td className="px-4 py-3">
                    <GilAmount amount={l.price_per_unit} />
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{l.quantity}</td>
                  <td className="px-4 py-3">
                    <GilAmount amount={l.total} />
                  </td>
                  <td className="px-4 py-3">
                    {l.hq === 1 && (
                      <span className="rounded bg-cyan-900/50 px-2 py-0.5 text-xs text-cyan-400">
                        HQ
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{l.retainer_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
