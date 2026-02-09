import { PageShell } from "@/components/layout/PageShell";
import { useTaxRates } from "@/hooks/useStatus";
import { formatRelativeTime } from "@/lib/format";
import { CITY_NAMES, CITY_KEYS } from "@/lib/constants";
import type { CityKey } from "@/lib/constants";
import type { TaxRate } from "@/types/api";

function rateColor(rate: number): string {
  if (rate === 0) return "text-aether-400";
  if (rate <= 3) return "text-obsidian-300";
  if (rate <= 5) return "text-gold-400";
  return "text-ember-400";
}

export function TaxRatesPage() {
  const { data, isLoading } = useTaxRates();
  const rates = data?.data ?? [];

  const latestUpdate = rates.length > 0
    ? rates.reduce((latest, r) =>
        new Date(r.updated_at) > new Date(latest.updated_at) ? r : latest
      ).updated_at
    : null;

  return (
    <PageShell title="稅率資訊">
      <div className="overflow-x-auto rounded-lg border border-obsidian-800 bg-obsidian-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-obsidian-800 text-left text-xs uppercase tracking-wider text-obsidian-400">
              <th className="sticky left-0 bg-obsidian-900 px-4 py-3 font-medium">伺服器</th>
              {CITY_KEYS.map((key) => (
                <th key={key} className="px-4 py-3 font-medium whitespace-nowrap">
                  {CITY_NAMES[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-obsidian-800/50">
                  <td className="sticky left-0 bg-obsidian-900 px-4 py-3">
                    <div className="animate-skeleton h-4 w-20 rounded" />
                  </td>
                  {CITY_KEYS.map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="animate-skeleton h-4 w-10 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && rates.length === 0 && (
              <tr>
                <td
                  colSpan={CITY_KEYS.length + 1}
                  className="px-4 py-12 text-center text-obsidian-500"
                >
                  暫無稅率資料
                </td>
              </tr>
            )}
            {rates.map((rate: TaxRate) => (
              <tr
                key={rate.world_id}
                className="border-b border-obsidian-800/50 hover:bg-gold-500/[0.03]"
              >
                <td className="sticky left-0 bg-obsidian-900 px-4 py-3 font-medium text-gold-400">
                  {rate.world_name}
                </td>
                {CITY_KEYS.map((key: CityKey) => {
                  const value = rate[key];
                  return (
                    <td key={key} className={`px-4 py-3 font-mono ${rateColor(value)}`}>
                      {value}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {latestUpdate && (
        <p className="text-sm text-obsidian-500">
          更新時間：{formatRelativeTime(latestUpdate)}
        </p>
      )}
    </PageShell>
  );
}
