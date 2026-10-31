import { PageHeader } from "@/components/admin/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailLoading() {
  return (
    <div className="flex min-h-full flex-col lg:h-svh lg:min-h-0">
      <PageHeader
        backHref="/admin/users"
        className="max-w-none"
        title="Users"
        actions={<Skeleton className="size-8" />}
      />

      <main className="flex flex-1 flex-col gap-4 p-4 lg:min-h-0 lg:flex-row lg:gap-5 lg:p-5">
        <aside className="shrink-0 space-y-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm lg:w-88 xl:w-96">
          <Skeleton className="h-3 w-16" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-14 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-7 w-40 max-w-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="flex justify-between px-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-11 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
