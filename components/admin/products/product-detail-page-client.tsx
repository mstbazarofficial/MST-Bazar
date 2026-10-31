"use client";

import ProductDetailSkeleton from "@/app/(admin)/admin/products/[slug]/skeleton";
import { ProductDescriptions } from "@/components/admin/products/product-descriptions";
import { ProductDetailHeader } from "@/components/admin/products/product-detail-header";
import { ProductOrdersCard } from "@/components/admin/products/product-orders-card";
import { ProductOverview } from "@/components/admin/products/product-overview";
import { ProductSidebar } from "@/components/admin/products/product-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";
import { FileText, LayoutGrid, ShoppingBag } from "lucide-react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";

const PRODUCT_TABS = ["overview", "description", "orders"] as const;
type ProductTab = (typeof PRODUCT_TABS)[number];

function isProductTab(value: string | null): value is ProductTab {
  return PRODUCT_TABS.includes(value as ProductTab);
}

function TabPanel({
  value,
  children,
}: {
  value: ProductTab;
  children: ReactNode;
}) {
  return (
    <TabsContent
      value={value}
      className="scrollbar-slim min-h-0 pt-4 lg:overflow-y-auto lg:pr-1"
    >
      {children}
    </TabsContent>
  );
}

export function ProductDetailPageClient() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<ProductTab>(() => {
    const tab = searchParams.get("tab");
    return isProductTab(tab) ? tab : "overview";
  });

  const { data: product } = useQuery({
    queryKey: ["admin-product", slug],
    queryFn: () => adminFetch("product", { slug }),
  });

  const productId = product?.id;
  const { data: orders } = useQuery({
    queryKey: ["admin-product-orders", productId],
    queryFn: () => adminFetch("productOrders", { productId }),
    enabled: !!productId,
  });

  // Replaced, not pushed, so the back button leaves the page, not the tab.
  const handleTabChange = (tab: ProductTab) => {
    setActiveTab(tab);

    const url = new URL(window.location.href);
    if (tab === "overview") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tab);
    window.history.replaceState(window.history.state, "", url.toString());
  };

  if (product === undefined) return <ProductDetailSkeleton />;
  if (product === null) notFound();

  return (
    <div className="flex min-h-full flex-col lg:h-svh lg:min-h-0">
      <ProductDetailHeader
        product={{
          id: product.id,
          title: product.title,
          slug: product.slug,
          isAvailable: product.isAvailable,
        }}
      />

      {/* On large screens each pane scrolls on its own */}
      <main className="flex flex-1 flex-col gap-4 p-4 lg:min-h-0 lg:flex-row lg:gap-5 lg:p-5">
        <ProductSidebar product={product} />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="min-w-0 flex-1 gap-0 lg:min-h-0"
        >
          <div className="sticky top-14 z-4 shrink-0 bg-dashboard-background py-1 lg:static lg:py-0">
            <TabsList className="w-full flex-wrap justify-start rounded-xl border border-border p-1 group-data-horizontal/tabs:h-auto">
              {[
                { value: "overview", label: "Overview", icon: LayoutGrid },
                { value: "description", label: "Description", icon: FileText },
                {
                  value: "orders",
                  label: "Orders",
                  icon: ShoppingBag,
                  count: orders?.total,
                },
              ].map(({ value, label, icon: Icon, count }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="h-9.5 min-w-fit rounded-lg px-3 data-active:text-primary"
                >
                  <Icon />
                  {label}
                  {count !== undefined && (
                    <span className="rounded-full bg-primary/10 px-1.5 text-[11px] font-medium text-primary tabular-nums">
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabPanel value="overview">
            <ProductOverview product={product} sales={orders} />
          </TabPanel>

          <TabPanel value="description">
            <ProductDescriptions productDetails={product.productDetails} />
          </TabPanel>

          <TabPanel value="orders">
            <ProductOrdersCard orders={orders} />
          </TabPanel>
        </Tabs>
      </main>
    </div>
  );
}
