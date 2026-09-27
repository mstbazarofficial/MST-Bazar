import { BannerRowActions } from "@/components/admin/banners/banner-row-actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LinkIcon } from "lucide-react";
import Image from "next/image";

type Banner = {
  id: string;
  title: string | null;
  imageUrl: string;
  linkUrl: string | null;
  placement: "HERO_SLIDER" | "HERO_SIDE_BANNER" | "PROMO_BANNER";
  order: number;
  isActive: boolean;
};

export function BannerCard({
  banner,
  aspectRatio,
}: {
  banner: Banner;
  aspectRatio: "square" | "wide";
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div
        className={cn(
          "relative w-full bg-muted",
          aspectRatio === "square" ? "aspect-square" : "aspect-5/2",
        )}
      >
        <Image
          src={banner.imageUrl}
          alt={banner.title || "Banner image"}
          fill
          sizes={
            aspectRatio === "square"
              ? "(max-width: 640px) 100vw, 400px"
              : "(max-width: 1024px) 100vw, 600px"
          }
          className="object-cover"
        />
        <Badge
          variant={banner.isActive ? "default" : "secondary"}
          className="absolute right-2 top-2"
        >
          {banner.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-3 p-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium">
            {banner.title || "Untitled"}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="font-mono text-xs">
              Order {banner.order}
            </Badge>
            {banner.linkUrl && (
              <span className="flex min-w-0 items-center gap-1 truncate">
                <LinkIcon className="size-3 shrink-0" />
                <span className="truncate">{banner.linkUrl}</span>
              </span>
            )}
          </div>
        </div>

        <BannerRowActions bannerId={banner.id} bannerTitle={banner.title} />
      </div>
    </div>
  );
}
