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
import { FINANCE_COLORS } from "@/lib/analytics/chart-colors";
import { formatCompactNumber } from "@/lib/analytics/format";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  income: { label: "Income", color: FINANCE_COLORS.income },
  expenses: { label: "Expenses", color: FINANCE_COLORS.expenses },
} satisfies ChartConfig;

export function FinanceMonthlyChart({
  data,
}: {
  data: { month: string; income: number; expenses: number }[];
}) {
  return (
    <Card className="h-full border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Income and expenses
        </CardTitle>
        <p className="text-sm text-muted-foreground">Last 12 months</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={data} margin={{ left: 4, right: 12 }} barGap={2}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(month) => String(month).slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => formatCompactNumber(Number(v))}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={[4, 4, 0, 0]}
              maxBarSize={16}
            />
            <Bar
              dataKey="expenses"
              fill="var(--color-expenses)"
              radius={[4, 4, 0, 0]}
              maxBarSize={16}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
