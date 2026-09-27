"use client";

import { BannerSection } from "@/components/admin/banners/banner-section";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Banner = {
  id: string;
  title: string | null;
  imageUrl: string;
  linkUrl: string | null;
  placement: "HERO_SLIDER" | "HERO_SIDE_BANNER" | "PROMO_BANNER";
  order: number;
  isActive: boolean;
};

type ActiveFilter = "all" | "active" | "inactive";

export function BannerPageClient({
  initialBanners,
}: {
  initialBanners: Banner[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

  // Update input & URL parameters silently without triggering Next.js server navigation
  const handleSearch = (term: string) => {
    setSearch(term);

    const params = new URLSearchParams(window.location.search);
    if (term.trim()) {
      params.set("search", term.trim());
    } else {
      params.delete("search");
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    window.history.replaceState(null, "", newUrl);
  };

  // Instant in-memory filtering
  const filteredBanners = useMemo(() => {
    let result = initialBanners;

    if (activeFilter !== "all") {
      const wantActive = activeFilter === "active";
      result = result.filter((b) => b.isActive === wantActive);
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter((b) =>
        (b.title ?? "").toLowerCase().includes(query),
      );
    }

    return result;
  }, [initialBanners, search, activeFilter]);

  const sideBanners = filteredBanners.filter(
    (b) => b.placement === "HERO_SIDE_BANNER",
  );
  const sliderBanners = filteredBanners.filter(
    (b) => b.placement === "HERO_SLIDER",
  );
  const promoBanners = filteredBanners.filter(
    (b) => b.placement === "PROMO_BANNER",
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search banners..."
          className="w-full bg-card "
        />
        <NativeSelect
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
          className="w-full bg-card sm:w-40"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </NativeSelect>
      </div>

      <BannerSection
        title="Hero Side Banner"
        description="Right-side standalone image (1:1)"
        banners={sideBanners}
        aspectRatio="square"
      />

      <BannerSection
        title="Hero Slider"
        description="Left carousel slides (5:2)"
        banners={sliderBanners}
        aspectRatio="wide"
      />

      {promoBanners.length > 0 && (
        <BannerSection
          title="Promo Banners"
          banners={promoBanners}
          aspectRatio="wide"
        />
      )}

      {filteredBanners.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center text-sm text-muted-foreground">
          No banners found.
        </div>
      )}
    </div>
  );
}
