"use client";

import { BannerFormPage } from "@/components/admin/banners/banner-form-page";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import EditBannerLoading from "./loading";

export default function EditBannerPage() {
  const { id } = useParams<{ id: string }>();

  const { data: banner } = useQuery({
    queryKey: ["admin-banner", id],
    queryFn: () => adminFetch("banner", { id }),
    staleTime: 0,
    gcTime: 0,
  });

  if (banner === undefined) return <EditBannerLoading />;
  if (banner === null) notFound();

  return <BannerFormPage initialValues={banner} />;
}
