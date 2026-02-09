import { formatGil } from "@/lib/format";

interface GilAmountProps {
  amount: number | null;
}

export function GilAmount({ amount }: GilAmountProps) {
  return <span className="font-mono text-shimmer">{formatGil(amount)}</span>;
}
