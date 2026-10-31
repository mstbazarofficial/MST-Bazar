import { FiltersBarSkeleton } from "@/components/admin/layout/loading-skeletons";
import { PageHeader } from "@/components/admin/layout/page-header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminContactsLoading() {
  return (
    <>
      <PageHeader title="Contacts List" />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <FiltersBarSkeleton />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="w-full gap-0 overflow-hidden rounded-xl border py-0 shadow-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 pt-5 pb-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </CardHeader>

              <CardContent className="space-y-3 py-4">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-16 w-full" />
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t bg-muted/10 py-4">
                <Skeleton className="h-9 w-36" />
                <Skeleton className="size-9" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
