import { Card } from "@/components/ui/Card";
import { useStatus } from "@/hooks/useStatus";
import { formatRelativeTime } from "@/lib/format";
import { Skeleton } from "@/components/ui/Skeleton";

export function SystemStatusCard() {
  const { data, isLoading } = useStatus();

  if (isLoading) {
    return (
      <Card title="系統狀態">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </Card>
    );
  }

  const isOk = data?.status === "ok";

  return (
    <Card title="系統狀態">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${isOk ? "bg-aether-400 animate-glow-pulse text-aether-400" : "bg-ember-400 animate-glow-pulse text-ember-400"}`}
          />
          <span className="text-obsidian-300">
            {isOk ? "正常運作" : "異常"}
          </span>
        </div>
        <div className="text-obsidian-400">
          資料中心：<span className="text-obsidian-200">{data?.datacenter ?? "-"}</span>
        </div>
        <div className="text-obsidian-400">
          伺服器數量：<span className="text-obsidian-200">{data?.worlds ?? "-"}</span>
        </div>
        <div className="text-obsidian-400">
          最後更新：<span className="text-obsidian-200">{formatRelativeTime(data?.lastPollTime)}</span>
        </div>
      </div>
    </Card>
  );
}
