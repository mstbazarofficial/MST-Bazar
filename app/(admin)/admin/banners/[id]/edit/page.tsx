// app/admin/banners/[id]/edit/page.tsx
import { getAdminBannerById } from "@/actions/admin/banner-actions";
import { BannerFormPage } from "@/components/admin/banners/banner-form-page";
import { notFound } from "next/navigation";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await getAdminBannerById(id);

  if (!banner) notFound();

  return <BannerFormPage initialValues={banner} />;
}
