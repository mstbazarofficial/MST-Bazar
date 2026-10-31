"use client";

import PromoCodesSkeleton from "@/app/(admin)/admin/promo-codes/skeleton";
import { PromoCodesPageHeader } from "@/components/admin/promo-codes/promo-codes-page-header";
import { PromoCodesTable } from "@/components/admin/promo-codes/promo-codes-table";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";

export function PromoCodesPageClient() {
  const { data: promoCodes } = useQuery({
    queryKey: ["admin-promo-codes"],
    queryFn: () => adminFetch("promoCodes"),
  });

  if (!promoCodes) return <PromoCodesSkeleton />;

  return (
    <>
      <PromoCodesPageHeader />
      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <PromoCodesTable promoCodes={promoCodes} />
      </main>
    </>
  );
}
