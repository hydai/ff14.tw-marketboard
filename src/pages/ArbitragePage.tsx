import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "@/components/layout/PageShell";
import { useArbitrage } from "@/hooks/useAnalytics";
import { formatGil } from "@/lib/format";
import { getItemNameZh } from "@/lib/item-names";

export function ArbitragePage() {
  const [minProfit, setMinProfit] = useState<number | undefined>();
  const [minProfitPct, setMinProfitPct] = useState<number | undefined>();
  const [category, setCategory] = useState<number | undefined>();

  const { data, isLoading } = useArbitrage({ minProfit, minProfitPct, category });
  const items = data?.data ?? [];

  return (
    <PageShell title="跨服套利">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm text-zinc-400">
          最低利潤
          <input
            type="number"
            className="w-36 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-100 placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
            placeholder="例：5000"
            value={minProfit ?? ""}
            onChange={(e) =>
              setMinProfit(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-400">
          最低利潤%
          <input
            type="number"
            className="w-36 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-100 placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
            placeholder="例：10"
            value={minProfitPct ?? ""}
            onChange={(e) =>
              setMinProfitPct(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-400">
          分類
          <input
            type="number"
            className="w-36 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-100 placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
            placeholder="分類 ID"
            value={category ?? ""}
            onChange={(e) =>
              setCategory(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-400">
              <th className="px-4 py-3 font-medium">物品</th>
              <th className="px-4 py-3 font-medium">買入伺服器</th>
              <th className="px-4 py-3 font-medium">買入價</th>
              <th className="px-4 py-3 font-medium">賣出伺服器</th>
              <th className="px-4 py-3 font-medium">賣出價</th>
              <th className="px-4 py-3 font-medium">利潤</th>
              <th className="px-4 py-3 font-medium">利潤率</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-zinc-800/50">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                  目前沒有套利機會
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr
                key={`${item.item_id}-${item.buy_world}-${item.sell_world}`}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/items/${item.item_id}`}
                    className="text-gold-400 hover:text-gold-300 hover:underline"
                  >
                    {getItemNameZh(item.item_id, item.item_name)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-300">{item.buy_world}</td>
                <td className="px-4 py-3 text-gold-400">{formatGil(item.buy_price)}</td>
                <td className="px-4 py-3 text-zinc-300">{item.sell_world}</td>
                <td className="px-4 py-3 text-zinc-300">{formatGil(item.sell_price)}</td>
                <td className="px-4 py-3 text-emerald-400">{formatGil(item.profit)}</td>
                <td className="px-4 py-3 text-emerald-400">{item.profit_pct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
