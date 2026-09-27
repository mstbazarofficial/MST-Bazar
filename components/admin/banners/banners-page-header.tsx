import { PageHeader } from "@/components/admin/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function BannersPageHeader() {
  return (
    <PageHeader
      title="Banners"
      actions={
        <Link
          href="/admin/banners/new"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="size-4" />
          Add Banner
        </Link>
      }
    />
  );
}
