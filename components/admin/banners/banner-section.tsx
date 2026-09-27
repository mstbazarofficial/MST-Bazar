import { BannerCard } from "@/components/admin/banners/banner-card";

type Banner = {
  id: string;
  title: string | null;
  imageUrl: string;
  linkUrl: string | null;
  placement: "HERO_SLIDER" | "HERO_SIDE_BANNER" | "PROMO_BANNER";
  order: number;
  isActive: boolean;
};

export function BannerSection({
  title,
  description,
  banners,
  aspectRatio,
}: {
  title: string;
  description?: string;
  banners: Banner[];
  aspectRatio: "square" | "wide";
}) {
  // Hide empty sections entirely rather than showing an empty grid,
  // except when filters produce zero results across every section
  // (handled by the parent's own empty state).
  if (banners.length === 0) return null;

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div
        className={
          aspectRatio === "square"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "grid grid-cols-1 gap-4 lg:grid-cols-2"
        }
      >
        {banners.map((banner) => (
          <BannerCard
            key={banner.id}
            banner={banner}
            aspectRatio={aspectRatio}
          />
        ))}
      </div>
    </div>
  );
}
