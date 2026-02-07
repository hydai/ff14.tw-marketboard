import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { GilAmount } from "@/components/ui/GilAmount";
import { ItemLink } from "@/components/ui/ItemLink";
import { PriceChange } from "@/components/ui/PriceChange";
import { useDeals } from "@/hooks/useAnalytics";
import { getItemNameZh } from "@/lib/item-names";
import type { DealItem } from "@/types/api";

const columns: Column<DealItem>[] = [
  {
    key: "item_name",
    header: "物品",
    render: (row) => <ItemLink itemId={row.item_id} name={getItemNameZh(row.item_id, row.item_name)} />,
  },
  {
    key: "world_name",
    header: "伺服器",
  },
  {
    key: "current_price",
    header: "現價",
    render: (row) => <GilAmount amount={row.current_price} />,
  },
  {
    key: "discount",
    header: "折扣",
    render: (row) => <PriceChange value={-row.discount} />,
  },
];

export function DealsPreview() {
  const { data, isLoading } = useDeals({ limit: 10 });

  return (
    <Card title="撿漏排行">
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
      />
    </Card>
  );
}
