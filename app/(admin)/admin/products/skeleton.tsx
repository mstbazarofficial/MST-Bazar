import { FiltersBarSkeleton } from "@/components/admin/layout/loading-skeletons";
import { PageHeader } from "@/components/admin/layout/page-header";
import { ProductStatsCards } from "@/components/admin/products/product-stats-cards";
import { ProductsTable } from "@/components/admin/products/products-table";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminProductsLoading() {
  return (
    <>
      <PageHeader
        title="Products List"
        actions={
          <Link
            href="/admin/products/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="size-4" />
            Add product
          </Link>
        }
      />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <ProductStatsCards isLoading />
        <FiltersBarSkeleton
          stackUntil="sm"
          selectWidths={["sm:w-48", "sm:w-44"]}
        />
        <ProductsTable products={[]} isLoading />
      </main>
    </>
  );
}
