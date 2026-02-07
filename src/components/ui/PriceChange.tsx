import { formatPercent } from "@/lib/format";

interface PriceChangeProps {
  value: number | null;
}

export function PriceChange({ value }: PriceChangeProps) {
  if (value == null) {
    return <span className="text-zinc-500">-</span>;
  }

  const color = value > 0 ? "text-emerald-400" : value < 0 ? "text-red-400" : "text-zinc-400";

  return <span className={color}>{formatPercent(value)}</span>;
}
