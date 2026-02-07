import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useRecentSales } from "@/hooks/usePrices";
import { formatGil } from "@/lib/format";

interface SalesChartProps {
  itemId: number;
}

export function SalesChart({ itemId }: SalesChartProps) {
  const { data, isLoading } = useRecentSales(itemId, { days: 7 });

  const nqData = (data?.data ?? [])
    .filter((s) => s.hq !== 1)
    .map((s) => ({
      time: new Date(s.sold_at).getTime(),
      price: s.price_per_unit,
      quantity: s.quantity,
    }));

  const hqData = (data?.data ?? [])
    .filter((s) => s.hq === 1)
    .map((s) => ({
      time: new Date(s.sold_at).getTime(),
      price: s.price_per_unit,
      quantity: s.quantity,
    }));

  const formatXAxis = (value: number) => {
    const d = new Date(value);
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-4 text-sm font-medium text-zinc-300">近期成交紀錄</h3>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-zinc-500">
          載入中...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis
              dataKey="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatXAxis}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              stroke="#3f3f46"
              name="時間"
            />
            <YAxis
              dataKey="price"
              type="number"
              tickFormatter={(v: number) => formatGil(v)}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              stroke="#3f3f46"
              width={80}
              name="單價"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: 8,
              }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: number, name: string) => {
                if (name === "單價") return [formatGil(value), name];
                if (name === "數量") return [value, name];
                return [value, name];
              }}
              labelFormatter={(value: number) => {
                const d = new Date(value);
                return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
              }}
            />
            <Legend />
            <Scatter
              name="NQ"
              data={nqData}
              fill="#fbbf24"
            />
            <Scatter
              name="HQ"
              data={hqData}
              fill="#22d3ee"
            />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
