import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { usePriceHistory } from "@/hooks/usePrices";
import { getHistoryTimestamp, formatGil } from "@/lib/format";
import { PRICE_PERIODS, PRICE_RESOLUTIONS } from "@/lib/constants";
import type { PricePeriod, PriceResolution } from "@/types/api";

interface PriceHistoryChartProps {
  itemId: number;
}

export function PriceHistoryChart({ itemId }: PriceHistoryChartProps) {
  const [period, setPeriod] = useState<PricePeriod>("7d");
  const [resolution, setResolution] = useState<PriceResolution>("hourly");

  const { data, isLoading } = usePriceHistory(itemId, { period, resolution });

  const isShortPeriod = period === "1d" || period === "3d";

  const chartData = (data?.data ?? []).map((point) => {
    const ts = getHistoryTimestamp(point as unknown as Record<string, unknown>, resolution);
    return {
      time: ts,
      nq: point.min_price_nq,
      hq: point.min_price_hq,
    };
  });

  const formatXAxis = (value: string) => {
    const d = new Date(value);
    if (isShortPeriod) {
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex gap-1">
          {PRICE_PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as PricePeriod)}
              className={`rounded px-2.5 py-1 text-xs transition-colors ${
                period === p.value
                  ? "bg-gold-500 text-zinc-900"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {PRICE_RESOLUTIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setResolution(r.value as PriceResolution)}
              className={`rounded px-2.5 py-1 text-xs transition-colors ${
                resolution === r.value
                  ? "bg-gold-500 text-zinc-900"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-zinc-500">
          載入中...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              stroke="#3f3f46"
            />
            <YAxis
              tickFormatter={(v: number) => formatGil(v)}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              stroke="#3f3f46"
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: 8,
              }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: number, name: string) => [
                formatGil(value),
                name === "nq" ? "NQ 最低價" : "HQ 最低價",
              ]}
              labelFormatter={formatXAxis}
            />
            <Legend
              formatter={(value: string) =>
                value === "nq" ? "NQ 最低價" : "HQ 最低價"
              }
            />
            <Line
              type="monotone"
              dataKey="nq"
              stroke="#fbbf24"
              dot={false}
              strokeWidth={2}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="hq"
              stroke="#22d3ee"
              dot={false}
              strokeWidth={2}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
