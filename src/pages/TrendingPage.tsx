import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "@/components/layout/PageShell";
import { useTrending } from "@/hooks/useAnalytics";
import { formatGil } from "@/lib/format";
import { TREND_DIRECTIONS, TREND_PERIODS } from "@/lib/constants";
import { getItemNameZh } from "@/lib/item-names";
import type { TrendDirection, TrendPeriod } from "@/types/api";

export function TrendingPage() {
  const [direction, setDirection] = useState<TrendDirection>("up");
  const [period, setPeriod] = useState<TrendPeriod>("1d");

  const { data, isLoading } = useTrending({ direction, period });
  const items = data?.data ?? [];

  return (
    <PageShell title="趨勢分析">
      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">方向</span>
          <div className="flex overflow-hidden rounded-md border border-zinc-700">
            {TREND_DIRECTIONS.map((d) => (
              <button
                key={d.value}
                className={`px-4 py-1.5 text-sm transition-colors ${
                  direction === d.value
                    ? "bg-gold-500/20 text-gold-400"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
                onClick={() => setDirection(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">週期</span>
          <div className="flex overflow-hidden rounded-md border border-zinc-700">
            {TREND_PERIODS.map((p) => (
              <button
                key={p.value}
                className={`px-4 py-1.5 text-sm transition-colors ${
                  period === p.value
                    ? "bg-gold-500/20 text-gold-400"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-400">
              <th className="px-4 py-3 font-medium">物品</th>
              <th className="px-4 py-3 font-medium">現價</th>
              <th className="px-4 py-3 font-medium">前期價</th>
              <th className="px-4 py-3 font-medium">變化</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-zinc-800/50">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-zinc-500">
                  目前沒有趨勢資料
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr
                key={item.item_id}
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
                <td className="px-4 py-3 text-zinc-300">{formatGil(item.current_price)}</td>
                <td className="px-4 py-3 text-zinc-300">{formatGil(item.previous_price)}</td>
                <td
                  className={`px-4 py-3 ${
                    item.change_pct >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {item.change_pct > 0 ? "+" : ""}
                  {item.change_pct.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
