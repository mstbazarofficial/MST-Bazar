import { getAdminBanners } from "@/actions/admin/banner-actions";
import { BannerPageClient } from "@/components/admin/banners/banner-page-client";
import { BannersPageHeader } from "@/components/admin/banners/banners-page-header";

export default async function AdminBannersPage() {
  const initialBanners = await getAdminBanners();

  return (
    <>
      <BannersPageHeader />
      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <BannerPageClient initialBanners={initialBanners} />
      </main>
    </>
  );
}
