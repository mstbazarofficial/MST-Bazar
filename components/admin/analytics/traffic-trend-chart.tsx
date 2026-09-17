"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CHART_COLORS } from "@/lib/analytics/chart-colors";
import { formatCompactNumber, formatShortDate } from "@/lib/analytics/format";
import type { TrendPoint } from "@/lib/analytics/types";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  users: { label: "Users", color: CHART_COLORS.primary },
  sessions: { label: "Sessions", color: CHART_COLORS.secondary },
  pageviews: { label: "Pageviews", color: CHART_COLORS.tertiary },
} satisfies ChartConfig;

export function TrafficTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Traffic over time
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Users, sessions, and pageviews for the selected period
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <LineChart data={data} margin={{ left: 4, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatShortDate}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => formatCompactNumber(Number(v))}
              width={40}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatShortDate(String(value))}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="users"
              type="monotone"
              stroke="var(--color-users)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="sessions"
              type="monotone"
              stroke="var(--color-sessions)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="pageviews"
              type="monotone"
              stroke="var(--color-pageviews)"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
