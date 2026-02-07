import { formatGil } from "@/lib/format";

interface GilAmountProps {
  amount: number | null;
}

export function GilAmount({ amount }: GilAmountProps) {
  return <span className="text-gold-400">{formatGil(amount)}</span>;
}
