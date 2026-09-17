"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DEVICE_COLORS } from "@/lib/analytics/chart-colors";
import { formatCompactNumber, formatPercent } from "@/lib/analytics/format";
import type { DeviceRow } from "@/lib/analytics/types";
import { Pie, PieChart } from "recharts";

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Mobile",
  desktop: "Desktop",
  tablet: "Tablet",
};

export function DeviceBreakdownCard({ data }: { data: DeviceRow[] }) {
  const total = data.reduce((sum, d) => sum + d.users, 0);
  const chartData = data.map((row) => ({
    ...row,
    fill: DEVICE_COLORS[row.device],
  }));

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Devices</CardTitle>
        <p className="text-sm text-muted-foreground">
          How visitors access Edugen
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 ">
        <ChartContainer config={{}} className="h-45 w-45 shrink-0">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => [
                    `${formatCompactNumber(Number(value))} users`,
                    ` · ${formatPercent(item.payload.share)}`,
                  ]}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="device"
              innerRadius={48}
              outerRadius={72}
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>

        <ul className="w-full space-y-3 sm:w-auto sm:min-w-40">
          {data.map((row) => (
            <li
              key={row.device}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: DEVICE_COLORS[row.device] }}
                />
                {DEVICE_LABELS[row.device] ?? row.device}
              </span>
              <span className="font-medium tabular-nums">
                {formatPercent(row.share)}
              </span>
            </li>
          ))}
          <li className="border-t pt-2 text-xs text-muted-foreground">
            {formatCompactNumber(total)} total users
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
