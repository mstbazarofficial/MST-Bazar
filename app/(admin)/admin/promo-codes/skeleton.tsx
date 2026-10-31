import {
  TableSkeleton,
  type SkeletonColumn,
} from "@/components/admin/layout/loading-skeletons";
import { PromoCodesPageHeader } from "@/components/admin/promo-codes/promo-codes-page-header";
import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS: SkeletonColumn[] = [
  {
    head: "Code",
    headClassName: "min-w-48 pl-4",
    cellClassName: "pl-4",
    cell: (
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    ),
  },
  {
    head: "Discount",
    headClassName: "min-w-36",
    cell: <Skeleton className="h-4 w-20" />,
  },
  {
    head: "Min. Order",
    headClassName: "w-32",
    cell: <Skeleton className="h-4 w-14" />,
  },
  {
    head: "Valid",
    headClassName: "min-w-52",
    cell: <Skeleton className="h-4 w-36" />,
  },
  {
    head: "Used",
    headClassName: "w-28 text-center",
    cell: <Skeleton className="mx-auto h-4 w-10" />,
  },
  {
    head: "Status",
    headClassName: "w-28 text-center",
    cell: <Skeleton className="mx-auto h-5 w-16 rounded-full" />,
  },
  {
    head: "Actions",
    headClassName: "w-36 pr-4 text-right",
    cellClassName: "pr-4",
    cell: <Skeleton className="ml-auto h-8 w-20" />,
  },
];

export default function AdminPromoCodesLoading() {
  return (
    <>
      <PromoCodesPageHeader />
      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <div className="overflow-hidden rounded-lg border bg-card">
          <TableSkeleton columns={COLUMNS} rows={5} />
        </div>
      </main>
    </>
  );
}
