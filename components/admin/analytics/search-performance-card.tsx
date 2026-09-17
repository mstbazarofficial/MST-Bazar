"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CHART_COLORS } from "@/lib/analytics/chart-colors";
import {
  formatCompactNumber,
  formatNumber,
  formatPercent,
  formatShortDate,
  truncateMiddle,
} from "@/lib/analytics/format";
import type { SearchPerformance } from "@/lib/analytics/types";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  clicks: { label: "Clicks", color: CHART_COLORS.primary },
  impressions: { label: "Impressions", color: CHART_COLORS.muted },
} satisfies ChartConfig;

function TotalStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function SearchPerformanceCard({ data }: { data: SearchPerformance }) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Search performance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How Edugen appears in Google Search results
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <TotalStat
            label="Clicks"
            value={formatCompactNumber(data.totals.clicks)}
          />
          <TotalStat
            label="Impressions"
            value={formatCompactNumber(data.totals.impressions)}
          />
          <TotalStat label="Avg. CTR" value={formatPercent(data.totals.ctr)} />
          <TotalStat
            label="Avg. position"
            value={data.totals.position.toFixed(1)}
          />
        </div>

        <ChartContainer config={chartConfig} className="h-55 w-full">
          <AreaChart data={data.trend} margin={{ left: 4, right: 12 }}>
            <defs>
              <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-clicks)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-clicks)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatShortDate}
              minTickGap={32}
            />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatShortDate(String(value))}
                />
              }
            />
            <Area
              dataKey="clicks"
              type="monotone"
              stroke="var(--color-clicks)"
              fill="url(#fillClicks)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>

        <Tabs defaultValue="queries">
          <TabsList>
            <TabsTrigger value="queries">Top queries</TabsTrigger>
            <TabsTrigger value="pages">Top pages</TabsTrigger>
          </TabsList>

          <TabsContent value="queries">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Impr.</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topQueries.map((row) => (
                  <TableRow key={row.query}>
                    <TableCell className="max-w-55 truncate font-medium">
                      {row.query}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(row.clicks)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(row.impressions)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPercent(row.ctr)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.position.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="pages">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Impr.</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topPages.map((row) => (
                  <TableRow key={row.page}>
                    <TableCell className="max-w-55 truncate font-medium">
                      {truncateMiddle(
                        row.page.replace(/^https?:\/\/[^/]+/, ""),
                        36,
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(row.clicks)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(row.impressions)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPercent(row.ctr)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.position.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
