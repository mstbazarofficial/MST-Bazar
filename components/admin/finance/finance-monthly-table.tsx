import { formatSigned } from "@/components/admin/finance/finance-summary-cards";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format-price";

export function FinanceMonthlyTable({
  data,
}: {
  data: { month: string; income: number; expenses: number }[];
}) {
  const months = [...data].reverse();

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-40 pl-4">Month</TableHead>
            <TableHead className="w-40 text-right">Income</TableHead>
            <TableHead className="w-40 text-right">Expenses</TableHead>
            <TableHead className="w-40 pr-4 text-right">Net Profit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {months.map(({ month, income, expenses }, index) => {
            const netProfit = income - expenses;

            return (
              <TableRow
                key={month}
                className={cn(
                  index === 0 && "bg-primary/10 hover:bg-primary/10",
                )}
              >
                <TableCell className="pl-4 text-sm font-medium text-foreground">
                  {month}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {formatPrice(income)}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {formatPrice(expenses)}
                </TableCell>
                <TableCell
                  className={cn(
                    "pr-4 text-right text-sm font-medium",
                    netProfit < 0 && "text-destructive",
                  )}
                >
                  {formatSigned(netProfit)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
