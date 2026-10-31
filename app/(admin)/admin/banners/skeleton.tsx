import { BannersPageHeader } from "@/components/admin/banners/banners-page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function BannerCardSkeleton({ aspect }: { aspect: string }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <Skeleton className={cn("w-full rounded-none", aspect)} />
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

function BannerSectionSkeleton({
  title,
  description,
  grid,
  aspect,
  cards,
}: {
  title: string;
  description: string;
  grid: string;
  aspect: string;
  cards: number;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className={cn("grid grid-cols-1 gap-4", grid)}>
        {Array.from({ length: cards }).map((_, i) => (
          <BannerCardSkeleton key={i} aspect={aspect} />
        ))}
      </div>
    </div>
  );
}

export default function AdminBannersLoading() {
  return (
    <>
      <BannersPageHeader />
      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <div className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full sm:w-40 sm:shrink-0" />
          </div>

          <BannerSectionSkeleton
            title="Hero Side Banner"
            description="Right-side standalone image (1:1)"
            grid="sm:grid-cols-2 lg:grid-cols-3"
            aspect="aspect-square"
            cards={1}
          />
          <BannerSectionSkeleton
            title="Hero Slider"
            description="Left carousel slides (5:2)"
            grid="lg:grid-cols-2"
            aspect="aspect-5/2"
            cards={2}
          />
        </div>
      </main>
    </>
  );
}
