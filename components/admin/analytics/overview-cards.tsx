import { Card } from "@/components/ui/card";
import {
  formatCompactNumber,
  formatDuration,
  formatPercent,
  formatSignedPercent,
} from "@/lib/analytics/format";
import type { OverviewMetrics } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

function DeltaBadge({
  value,
  goodDirection = "up",
}: {
  value: number;
  goodDirection?: "up" | "down";
}) {
  const isFlat = Math.abs(value) < 0.005;
  const isUp = value > 0;
  const isGood = goodDirection === "up" ? isUp : !isUp;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        isFlat
          ? "bg-muted text-muted-foreground"
          : isGood
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
      )}
    >
      {isFlat ? (
        <Minus className="h-3 w-3" />
      ) : isUp ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {formatSignedPercent(value)}
    </span>
  );
}

function MiniBar({
  value,
  max,
  good,
}: {
  value: number;
  max: number;
  good: boolean;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-0.75 w-full overflow-hidden rounded-full bg-border">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          good ? "bg-emerald-500" : "bg-rose-500",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function OverviewCards({ data }: { data: OverviewMetrics }) {
  const metrics = [
    {
      title: "Visitors",
      value: formatCompactNumber(data.users),
      delta: data.deltas.users,
      barValue: data.users,
      barMax: data.users,
      goodDirection: "up" as const,
    },
    {
      title: "Total visits",
      value: formatCompactNumber(data.sessions),
      delta: data.deltas.sessions,
      barValue: data.sessions,
      barMax: data.sessions,
      goodDirection: "up" as const,
    },
    {
      title: "Pageviews",
      value: formatCompactNumber(data.pageviews),
      delta: data.deltas.pageviews,
      barValue: data.pageviews,
      barMax: data.pageviews,
      goodDirection: "up" as const,
    },
    {
      title: "Avg. duration",
      value: formatDuration(data.avgEngagementTimeSec),
      delta: data.deltas.avgEngagementTimeSec,
      barValue: data.avgEngagementTimeSec,
      barMax: 600,
      goodDirection: "up" as const,
    },
    {
      title: "Bounce rate",
      value: formatPercent(data.bounceRate, 0),
      delta: data.deltas.bounceRate,
      barValue: data.bounceRate,
      barMax: 1,
      goodDirection: "down" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((item) => {
        const isFlat = Math.abs(item.delta) < 0.005;
        const isUp = item.delta > 0;
        const isGood = item.goodDirection === "up" ? isUp : !isUp;

        return (
          <Card
            key={item.title}
            className="flex flex-col gap-2.5 rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                {item.title}
              </span>
              <DeltaBadge
                value={item.delta}
                goodDirection={item.goodDirection}
              />
            </div>

            <div className="text-[26px] font-medium leading-none tracking-tight text-foreground tabular-nums">
              {item.value}
            </div>

            <MiniBar
              value={item.barValue}
              max={item.barMax}
              good={isFlat || isGood}
            />
          </Card>
        );
      })}
    </div>
  );
}
