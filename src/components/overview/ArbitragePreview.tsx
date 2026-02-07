import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { GilAmount } from "@/components/ui/GilAmount";
import { ItemLink } from "@/components/ui/ItemLink";
import { formatPercent } from "@/lib/format";
import { useArbitrage } from "@/hooks/useAnalytics";
import type { ArbitrageItem } from "@/types/api";

const columns: Column<ArbitrageItem>[] = [
  {
    key: "item_name",
    header: "物品",
    render: (row) => <ItemLink itemId={row.item_id} name={row.item_name} />,
  },
  {
    key: "buy",
    header: "買入",
    render: (row) => (
      <span>
        <span className="text-zinc-400">{row.buy_world} </span>
        <GilAmount amount={row.buy_price} />
      </span>
    ),
  },
  {
    key: "sell",
    header: "賣出",
    render: (row) => (
      <span>
        <span className="text-zinc-400">{row.sell_world} </span>
        <GilAmount amount={row.sell_price} />
      </span>
    ),
  },
  {
    key: "profit",
    header: "利潤",
    render: (row) => (
      <span>
        <GilAmount amount={row.profit} />
        <span className="ml-1 text-emerald-400 text-xs">
          {formatPercent(row.profit_pct)}
        </span>
      </span>
    ),
  },
];

export function ArbitragePreview() {
  const { data, isLoading } = useArbitrage({ limit: 8 });

  return (
    <Card title="跨服套利">
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
      />
    </Card>
  );
}
