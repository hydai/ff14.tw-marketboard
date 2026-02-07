import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { GilAmount } from "@/components/ui/GilAmount";
import { ItemLink } from "@/components/ui/ItemLink";
import { PriceChange } from "@/components/ui/PriceChange";
import { useTrending } from "@/hooks/useAnalytics";
import { getItemNameZh } from "@/lib/item-names";
import type { TrendingItem } from "@/types/api";

const columns: Column<TrendingItem>[] = [
  {
    key: "item_name",
    header: "物品",
    render: (row) => <ItemLink itemId={row.item_id} name={getItemNameZh(row.item_id, row.item_name)} />,
  },
  {
    key: "current_price",
    header: "現價",
    render: (row) => <GilAmount amount={row.current_price} />,
  },
  {
    key: "change_pct",
    header: "漲幅",
    render: (row) => <PriceChange value={row.change_pct} />,
  },
];

export function TrendingPreview() {
  const { data, isLoading } = useTrending({
    direction: "up",
    period: "3d",
    limit: 10,
  });

  return (
    <Card title="趨勢上漲">
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
      />
    </Card>
  );
}
