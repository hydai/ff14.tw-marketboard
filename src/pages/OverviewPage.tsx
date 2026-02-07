import { PageShell } from "@/components/layout/PageShell";
import { SystemStatusCard } from "@/components/overview/SystemStatusCard";
import { TrendingPreview } from "@/components/overview/TrendingPreview";
import { DealsPreview } from "@/components/overview/DealsPreview";
import { ArbitragePreview } from "@/components/overview/ArbitragePreview";
import { VelocityPreview } from "@/components/overview/VelocityPreview";

export function OverviewPage() {
  return (
    <PageShell title="市場總覽" description="陸行鳥資料中心即時市場資訊">
      <div className="space-y-6">
        <SystemStatusCard />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TrendingPreview />
          <DealsPreview />
          <ArbitragePreview />
          <VelocityPreview />
        </div>
      </div>
    </PageShell>
  );
}
