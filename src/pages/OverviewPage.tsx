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
        <div className="animate-reveal d1">
          <SystemStatusCard />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="animate-reveal d2">
            <TrendingPreview />
          </div>
          <div className="animate-reveal d3">
            <DealsPreview />
          </div>
          <div className="animate-reveal d4">
            <ArbitragePreview />
          </div>
          <div className="animate-reveal d5">
            <VelocityPreview />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
