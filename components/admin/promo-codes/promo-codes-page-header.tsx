import { PageHeader } from "@/components/admin/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function PromoCodesPageHeader() {
  return (
    <PageHeader
      title="Promo Codes"
      actions={
        <Link
          href="/admin/promo-codes/new"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="size-4" />
          Add Promo Code
        </Link>
      }
    />
  );
}
