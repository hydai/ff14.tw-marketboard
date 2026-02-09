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
    <div className="rounded-lg border border-obsidian-800 bg-obsidian-900/80 p-4 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex gap-1">
          {PRICE_PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as PricePeriod)}
              className={`rounded px-2.5 py-1 text-xs font-mono transition-colors ${
                period === p.value
                  ? "bg-gold-500 text-obsidian-900"
                  : "bg-obsidian-800 text-obsidian-400 hover:text-obsidian-200"
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
              className={`rounded px-2.5 py-1 text-xs font-mono transition-colors ${
                resolution === r.value
                  ? "bg-gold-500 text-obsidian-900"
                  : "bg-obsidian-800 text-obsidian-400 hover:text-obsidian-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-obsidian-500">
          載入中...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3d3730" />
            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              tick={{ fill: "#a8a29e", fontSize: 11, fontFamily: "JetBrains Mono" }}
              stroke="#3d3730"
            />
            <YAxis
              tickFormatter={(v: number) => formatGil(v)}
              tick={{ fill: "#a8a29e", fontSize: 11, fontFamily: "JetBrains Mono" }}
              stroke="#3d3730"
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1714",
                border: "1px solid #3d3730",
                borderRadius: 8,
                fontFamily: "JetBrains Mono",
              }}
              labelStyle={{ color: "#a8a29e" }}
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
              stroke="#38bdf8"
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
