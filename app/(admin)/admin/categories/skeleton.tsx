import { CategoriesPageHeader } from "@/components/admin/categories/categories-page-header";
import {
  TableSkeleton,
  type SkeletonColumn,
} from "@/components/admin/layout/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS: SkeletonColumn[] = [
  {
    head: "Image",
    headClassName: "w-16 text-center",
    cell: <Skeleton className="size-10 rounded-md" />,
  },
  { head: "Name", cell: <Skeleton className="h-4 w-32" /> },
  { head: "Slug", cell: <Skeleton className="h-4 w-28" /> },
  {
    head: "Priority",
    headClassName: "w-24 text-center",
    cell: <Skeleton className="mx-auto h-5 w-8 rounded-md" />,
  },
  {
    head: "Products",
    headClassName: "w-24 text-center",
    cell: <Skeleton className="mx-auto h-4 w-6" />,
  },
  {
    head: "Actions",
    headClassName: "w-28 text-right",
    cell: <Skeleton className="ml-auto h-8 w-16" />,
  },
];

export default function AdminCategoriesLoading() {
  return (
    <>
      <CategoriesPageHeader />
      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <div className="space-y-6">
          <Skeleton className="h-9 w-full" />

          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="overflow-hidden rounded-lg border bg-card">
              <TableSkeleton columns={COLUMNS} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
