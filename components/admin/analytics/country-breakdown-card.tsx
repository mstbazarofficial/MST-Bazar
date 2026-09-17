import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/analytics/format";
import type { CountryRow } from "@/lib/analytics/types";

export function CountryBreakdownCard({ data }: { data: CountryRow[] }) {
  const maxUsers = Math.max(...data.map((c) => c.users), 1);
  const bangladesh = data.find((c) => c.country === "Bangladesh");

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Visitors by country
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Where in the world people are visiting from
        </p>
      </CardHeader>
      <CardContent>
        {bangladesh && (
          <p className="mb-4 rounded-lg bg-muted/40 px-3.5 py-2.5 text-sm">
            <span className="font-semibold">
              {formatPercent(bangladesh.share, 0)}
            </span>{" "}
            of your visitors are from Bangladesh.
          </p>
        )}
        <ul className="space-y-3">
          {data.map((row) => (
            <li key={row.country} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium">
                    {row.country}
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
                    className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    style={{ width: `${(row.users / maxUsers) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
