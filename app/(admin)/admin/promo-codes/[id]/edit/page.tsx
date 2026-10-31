"use client";

import { PromoCodeFormPage } from "@/components/admin/promo-codes/promo-code-form-page";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import EditPromoCodeLoading from "./loading";

export default function EditPromoCodePage() {
  const { id } = useParams<{ id: string }>();

  const { data: promoCode } = useQuery({
    queryKey: ["admin-promo-code", id],
    queryFn: () => adminFetch("promoCode", { id }),
    staleTime: 0,
    gcTime: 0,
  });

  if (promoCode === undefined) return <EditPromoCodeLoading />;
  if (promoCode === null) notFound();

  return <PromoCodeFormPage initialValues={promoCode} />;
}
