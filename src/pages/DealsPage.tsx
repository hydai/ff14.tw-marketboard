import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "@/components/layout/PageShell";
import { useDeals } from "@/hooks/useAnalytics";
import { formatGil } from "@/lib/format";
import { getItemNameZh } from "@/lib/item-names";
import { WORLDS } from "@/lib/constants";

export function DealsPage() {
  const [maxPercentile, setMaxPercentile] = useState<number | undefined>();
  const [category, setCategory] = useState<number | undefined>();
  const [world, setWorld] = useState<string | undefined>();

  const { data, isLoading } = useDeals({ maxPercentile, category, world });
  const items = data?.data ?? [];

  return (
    <PageShell title="撿漏排行">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm text-obsidian-400">
          最高百分位
          <input
            type="number"
            className="w-36 rounded-md border border-obsidian-700 bg-obsidian-900 px-3 py-1.5 text-obsidian-100 placeholder-obsidian-500 focus:border-gold-500 focus:outline-none"
            placeholder="例：25"
            value={maxPercentile ?? ""}
            onChange={(e) =>
              setMaxPercentile(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-obsidian-400">
          分類
          <input
            type="number"
            className="w-36 rounded-md border border-obsidian-700 bg-obsidian-900 px-3 py-1.5 text-obsidian-100 placeholder-obsidian-500 focus:border-gold-500 focus:outline-none"
            placeholder="分類 ID"
            value={category ?? ""}
            onChange={(e) =>
              setCategory(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-obsidian-400">
          伺服器
          <select
            className="w-40 rounded-md border border-obsidian-700 bg-obsidian-900 px-3 py-1.5 text-obsidian-100 focus:border-gold-500 focus:outline-none"
            value={world ?? ""}
            onChange={(e) => setWorld(e.target.value || undefined)}
          >
            <option value="">全部</option>
            {WORLDS.map((w) => (
              <option key={w.id} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-obsidian-800 bg-obsidian-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-obsidian-800 text-left text-xs uppercase tracking-wider text-obsidian-400">
              <th className="px-4 py-3 font-medium">物品</th>
              <th className="px-4 py-3 font-medium">伺服器</th>
              <th className="px-4 py-3 font-medium">現價</th>
              <th className="px-4 py-3 font-medium">最高底價</th>
              <th className="px-4 py-3 font-medium">折扣</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-obsidian-800/50">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="animate-skeleton h-4 w-20 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-obsidian-500">
                  目前沒有撿漏機會
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr
                key={`${item.item_id}-${item.world_name}`}
                className="border-b border-obsidian-800/50 hover:bg-gold-500/[0.03]"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/items/${item.item_id}`}
                    className="text-gold-400 hover:text-gold-300 hover:underline"
                  >
                    {getItemNameZh(item.item_id, item.item_name)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-obsidian-300">{item.world_name}</td>
                <td className="px-4 py-3 font-mono text-gold-400">{formatGil(item.current_price)}</td>
                <td className="px-4 py-3 font-mono text-obsidian-300">{formatGil(item.average_price)}</td>
                <td className="px-4 py-3 font-mono text-aether-400">{item.discount.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
