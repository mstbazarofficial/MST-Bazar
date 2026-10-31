"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { FINANCE_COLORS } from "@/lib/analytics/chart-colors";
import { formatCompactNumber } from "@/lib/analytics/format";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  sales: { label: "Sales", color: FINANCE_COLORS.income },
} satisfies ChartConfig;

export function SalesChart({
  data,
}: {
  data: { day: string; sales: number }[];
}) {
  return (
    <Card className="h-full border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Sales</CardTitle>
        <p className="text-sm text-muted-foreground">
          Last 30 days, without cancelled or returned orders
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data} margin={{ left: 4, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => formatCompactNumber(Number(v))}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="sales"
              fill="var(--color-sales)"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
