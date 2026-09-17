import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/analytics/format";
import type { BrowserRow } from "@/lib/analytics/types";

export function BrowserBreakdownCard({ data }: { data: BrowserRow[] }) {
  const maxUsers = Math.max(...data.map((b) => b.users), 1);

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Browsers</CardTitle>
        <p className="text-sm text-muted-foreground">
          What visitors are using to browse Edugen
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {data.map((row) => (
            <li key={row.browser} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium">
                    {row.browser}
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
                    className="h-full rounded-full bg-amber-500 dark:bg-amber-400"
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
