import { formatPercent } from "@/lib/format";

interface PriceChangeProps {
  value: number | null;
}

export function PriceChange({ value }: PriceChangeProps) {
  if (value == null) {
    return <span className="text-obsidian-500">-</span>;
  }

  const color = value > 0 ? "text-aether-400" : value < 0 ? "text-ember-400" : "text-obsidian-400";

  return <span className={`font-mono ${color}`}>{formatPercent(value)}</span>;
}
