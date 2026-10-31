import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { PageHeader } from "@/components/admin/layout/page-header";
import {
  TableSkeleton,
  type SkeletonColumn,
} from "@/components/admin/layout/loading-skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const STATS = [
  { label: "TODAY'S SALES", borderColor: "border-l-emerald-500" },
  { label: "THIS MONTH'S SALES", borderColor: "border-l-blue-500" },
  { label: "PENDING ORDERS", borderColor: "border-l-purple-500" },
  { label: "CUSTOMERS OWE", borderColor: "border-l-amber-500" },
  { label: "YOU OWE SUPPLIERS", borderColor: "border-l-rose-500" },
];

const HEAD = "text-xs font-bold uppercase tracking-wider text-muted-foreground";
const WIDE_ONLY = "hidden sm:table-cell";

const ORDER_COLUMNS: SkeletonColumn[] = [
  { head: "CUSTOMER", headClassName: HEAD, cell: <Skeleton className="h-4 w-28" /> },
  {
    head: "ITEMS",
    headClassName: `${HEAD} ${WIDE_ONLY}`,
    cellClassName: WIDE_ONLY,
    cell: <Skeleton className="h-4 w-6" />,
  },
  { head: "AMOUNT", headClassName: HEAD, cell: <Skeleton className="h-4 w-16" /> },
  {
    head: "STATUS",
    headClassName: HEAD,
    cell: <Skeleton className="h-5 w-20 rounded-full" />,
  },
  {
    head: "DATE",
    headClassName: `${HEAD} ${WIDE_ONLY}`,
    cellClassName: WIDE_ONLY,
    cell: <Skeleton className="h-3 w-24" />,
  },
];

const USER_COLUMNS: SkeletonColumn[] = [
  {
    head: "USER",
    headClassName: HEAD,
    cell: (
      <div className="flex items-center gap-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    ),
  },
  {
    head: "EMAIL",
    headClassName: `${HEAD} ${WIDE_ONLY}`,
    cellClassName: WIDE_ONLY,
    cell: <Skeleton className="h-4 w-36" />,
  },
  {
    head: "JOINED DATE",
    headClassName: HEAD,
    cell: <Skeleton className="h-3 w-24" />,
  },
];

function RecentCard({
  title,
  href,
  columns,
}: {
  title: string;
  href: string;
  columns: SkeletonColumn[];
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="flex items-center justify-between p-4 pb-3">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <Link
          href={href}
          className="text-xs font-semibold text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-500"
        >
          View all &rarr;
        </Link>
      </div>
      <TableSkeleton columns={columns} rows={5} />
    </div>
  );
}

export default function AdminDashboardLoading() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {STATS.map(({ label, borderColor }) => (
            <Card
              key={label}
              className={`h-full border-y border-r border-border/60 border-l-4 ${borderColor} bg-card shadow-xs`}
            >
              <CardContent className="p-4">
                <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  {label}
                </span>
                <Skeleton className="mt-2 h-7 w-24" />
                <Skeleton className="mt-2 h-3 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <Card className="h-full border-border/60">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Sales</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last 30 days, without cancelled or returned orders
                </p>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <QuickActions />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <RecentCard
            title="Recent Orders"
            href="/admin/orders"
            columns={ORDER_COLUMNS}
          />
          <RecentCard
            title="Recent Users"
            href="/admin/users"
            columns={USER_COLUMNS}
          />
        </div>
      </main>
    </>
  );
}
