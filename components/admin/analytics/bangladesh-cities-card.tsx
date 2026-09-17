import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/analytics/format";
import type { CityRow } from "@/lib/analytics/types";

export function BangladeshCitiesCard({ data }: { data: CityRow[] }) {
  const maxUsers = Math.max(...data.map((c) => c.users), 1);

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Visitors by city in Bangladesh
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Where your Bangladeshi audience is coming from
        </p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No city-level data for this period yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {data.map((row, i) => (
              <li key={row.city} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-xs text-muted-foreground tabular-nums">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {row.city}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {formatNumber(row.users)}{" "}
                      <span className="text-xs">
                        ({formatPercent(row.share)})
                      </span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500"
                      style={{ width: `${(row.users / maxUsers) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
