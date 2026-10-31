import { PageHeader } from "@/components/admin/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <div className="flex min-h-full flex-col lg:h-svh lg:min-h-0">
      <PageHeader
        backHref="/admin/orders"
        className="max-w-none"
        title="Orders"
        actions={<Skeleton className="size-8" />}
      />

      <main className="flex flex-1 flex-col gap-4 p-4 lg:min-h-0 lg:flex-row lg:gap-5 lg:p-5">
        <aside className="shrink-0 space-y-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm lg:w-88 xl:w-96">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="flex justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="size-11 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
