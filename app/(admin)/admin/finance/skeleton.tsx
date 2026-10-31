import {
  TableSkeleton,
  type SkeletonColumn,
} from "@/components/admin/layout/loading-skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SUMMARY_LABELS = ["Income", "Expenses", "Net Profit", "Total Due"];

const EXPENSE_COLUMNS: SkeletonColumn[] = [
  {
    head: "Expense",
    headClassName: "min-w-52 pl-4",
    cellClassName: "pl-4",
    cell: (
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
    ),
  },
  {
    head: "Category",
    headClassName: "w-40",
    cell: <Skeleton className="h-5 w-20 rounded-full" />,
  },
  {
    head: "Date",
    headClassName: "w-32",
    cell: <Skeleton className="h-4 w-20" />,
  },
  {
    head: "Saved By",
    headClassName: "w-36",
    cell: <Skeleton className="h-4 w-24" />,
  },
  {
    head: "Amount",
    headClassName: "w-32 text-right",
    cell: <Skeleton className="ml-auto h-4 w-16" />,
  },
  {
    head: "Due",
    headClassName: "w-32 text-right",
    cell: <Skeleton className="ml-auto h-4 w-14" />,
  },
  {
    head: "Actions",
    headClassName: "w-28 pr-4 text-right",
    cellClassName: "pr-4",
    cell: <Skeleton className="ml-auto h-8 w-16" />,
  },
];

const MONTHLY_COLUMNS: SkeletonColumn[] = [
  {
    head: "Month",
    headClassName: "min-w-40 pl-4",
    cellClassName: "pl-4",
    cell: <Skeleton className="h-4 w-28" />,
  },
  ...["Income", "Expenses", "Net Profit"].map((head) => ({
    head,
    headClassName: "w-40 text-right last:pr-4",
    cellClassName: "last:pr-4",
    cell: <Skeleton className="ml-auto h-4 w-16" />,
  })),
];

export function FinanceDuesSkeleton({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </CardContent>
    </Card>
  );
}

export function FinanceOverviewSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <Skeleton className="mt-2 h-7 w-24" />
              <Skeleton className="mt-2 h-3 w-36" />
            </div>
            <Skeleton className="size-9 shrink-0 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card className="h-full border-border/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Income and expenses
              </CardTitle>
              <p className="text-sm text-muted-foreground">Last 12 months</p>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-72 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4">
          <Card className="h-full border-border/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Expenses by category
              </CardTitle>
              <p className="text-sm text-muted-foreground">For this period</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <TableSkeleton columns={MONTHLY_COLUMNS} rows={5} />
      </div>
    </>
  );
}

export function FinanceExpensesSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h2 className="text-base font-semibold text-foreground sm:mr-auto">
          Expenses
        </h2>
        <Skeleton className="h-9 w-full sm:w-64" />
        <Skeleton className="h-9 w-full sm:w-44" />
        <Skeleton className="h-8 w-full sm:w-28" />
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <TableSkeleton columns={EXPENSE_COLUMNS} rows={5} />
      </div>
    </section>
  );
}
