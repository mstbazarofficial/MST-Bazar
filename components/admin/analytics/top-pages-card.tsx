import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDuration,
  formatNumber,
  truncateMiddle,
} from "@/lib/analytics/format";
import type { TopPageRow } from "@/lib/analytics/types";

export function TopPagesCard({ data }: { data: TopPageRow[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Top pages</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your 10 most-viewed pages this period
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Avg. time on page</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell className="max-w-70">
                  <div className="truncate font-medium">
                    {row.title || row.path}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {truncateMiddle(row.path, 44)}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(row.pageviews)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatDuration(row.avgDurationSec)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
