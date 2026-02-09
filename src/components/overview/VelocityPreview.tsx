import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { GilAmount } from "@/components/ui/GilAmount";
import { ItemLink } from "@/components/ui/ItemLink";
import { useVelocity } from "@/hooks/useAnalytics";
import { getItemNameZh } from "@/lib/item-names";
import type { VelocityItem } from "@/types/api";

const columns: Column<VelocityItem>[] = [
  {
    key: "item_name",
    header: "物品",
    render: (row) => <ItemLink itemId={row.item_id} name={getItemNameZh(row.item_id, row.item_name)} />,
  },
  {
    key: "sales_per_day",
    header: "日均銷量",
    render: (row) => (
      <span className="font-mono text-obsidian-200">{row.sales_per_day.toFixed(1)}</span>
    ),
  },
  {
    key: "avg_price",
    header: "均價",
    render: (row) => <GilAmount amount={row.avg_price} />,
  },
  {
    key: "total_gil_per_day",
    header: "日均流通",
    render: (row) => <GilAmount amount={row.total_gil_per_day} />,
  },
];

export function VelocityPreview() {
  const { data, isLoading } = useVelocity({ limit: 10, days: 7 });

  return (
    <Card title="交易熱度">
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
      />
    </Card>
  );
}
