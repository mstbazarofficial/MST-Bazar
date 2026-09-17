"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHANNEL_COLORS } from "@/lib/analytics/chart-colors";
import { formatCompactNumber, formatPercent } from "@/lib/analytics/format";
import type { TrafficSourceRow } from "@/lib/analytics/types";

export function TrafficSourcesCard({ data }: { data: TrafficSourceRow[] }) {
  const sortedData = [...data].sort((a, b) => b.sessions - a.sessions);
  const maxSessions = Math.max(...sortedData.map((item) => item.sessions), 1);

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Traffic sources
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Where sessions came from this period
        </p>
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No traffic source data for this period yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {sortedData.map((row, i) => {
              const channelColor =
                CHANNEL_COLORS[row.channel] ?? CHANNEL_COLORS.Other;

              return (
                <li key={row.channel} className="flex items-center gap-3">
                  <span className="w-5 shrink-0 text-xs text-muted-foreground tabular-nums">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="flex items-center gap-2 truncate text-sm font-medium">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: channelColor }}
                        />
                        <span className="truncate">{row.channel}</span>
                      </span>
                      <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                        {formatCompactNumber(row.sessions)}{" "}
                        <span className="text-xs">
                          ({formatPercent(row.share)})
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(row.sessions / maxSessions) * 100}%`,
                          backgroundColor: channelColor,
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
