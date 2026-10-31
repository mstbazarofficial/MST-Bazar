import {
  FiltersBarSkeleton,
  TableSkeleton,
  type SkeletonColumn,
} from "@/components/admin/layout/loading-skeletons";
import { PageHeader } from "@/components/admin/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS: SkeletonColumn[] = [
  {
    head: "User",
    headClassName: "min-w-64 pl-4",
    cellClassName: "pl-4",
    cell: (
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    ),
  },
  {
    head: "Phone",
    headClassName: "w-40",
    cell: <Skeleton className="h-4 w-24" />,
  },
  {
    head: "Role",
    headClassName: "w-32 text-center",
    cell: <Skeleton className="mx-auto h-5 w-20 rounded-full" />,
  },
  {
    head: "Verified",
    headClassName: "w-32 text-center",
    cell: <Skeleton className="mx-auto h-4 w-16" />,
  },
  {
    head: "Joined Date",
    headClassName: "w-36 text-right pr-4",
    cellClassName: "pr-4",
    cell: <Skeleton className="ml-auto h-4 w-20" />,
  },
];

export default function AdminUsersLoading() {
  return (
    <>
      <PageHeader
        title="Users List"
        actions={<Skeleton className="h-8 w-28" />}
      />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <FiltersBarSkeleton />

        <div className="space-y-3 lg:hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-lg border bg-card lg:block">
          <TableSkeleton columns={COLUMNS} />
        </div>
      </main>
    </>
  );
}
