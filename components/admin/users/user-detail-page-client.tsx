"use client";

import UserDetailSkeleton from "@/app/(admin)/admin/users/[id]/skeleton";
import { UserCartCard } from "@/components/admin/users/user-cart-card";
import { UserDetailHeader } from "@/components/admin/users/user-details-header";
import { UserOrdersCard } from "@/components/admin/users/user-orders-card";
import { UserOverview } from "@/components/admin/users/user-overview";
import { UserSessionsCard } from "@/components/admin/users/user-sessions-card";
import { UserSidebar } from "@/components/admin/users/user-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModalParam } from "@/hooks/use-modal-param";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, Monitor, ShoppingBag, ShoppingCart } from "lucide-react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";

const USER_TABS = ["overview", "orders", "cart", "sessions"] as const;
type UserTab = (typeof USER_TABS)[number];

function isUserTab(value: string | null): value is UserTab {
  return USER_TABS.includes(value as UserTab);
}

function TabPanel({ value, children }: { value: UserTab; children: ReactNode }) {
  return (
    <TabsContent
      value={value}
      className="scrollbar-slim min-h-0 pt-4 lg:overflow-y-auto lg:pr-1"
    >
      {children}
    </TabsContent>
  );
}

export function UserDetailPageClient() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [editParam, setEditParam] = useModalParam("edit");

  const [activeTab, setActiveTab] = useState<UserTab>(() => {
    const tab = searchParams.get("tab");
    return isUserTab(tab) ? tab : "overview";
  });

  const { data: user } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => adminFetch("user", { id }),
  });

  // Replaced, not pushed, so the back button leaves the page, not the tab.
  const handleTabChange = (tab: UserTab) => {
    setActiveTab(tab);

    const url = new URL(window.location.href);
    if (tab === "overview") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tab);
    window.history.replaceState(window.history.state, "", url.toString());
  };

  if (user === undefined) return <UserDetailSkeleton />;
  if (user === null) notFound();

  const cartItems = user.cart?.items ?? [];

  return (
    <div className="flex min-h-full flex-col lg:h-svh lg:min-h-0">
      <UserDetailHeader
        user={user}
        editParam={editParam}
        setEditParam={setEditParam}
      />

      {/* On large screens each pane scrolls on its own */}
      <main className="flex flex-1 flex-col gap-4 p-4 lg:min-h-0 lg:flex-row lg:gap-5 lg:p-5">
        <UserSidebar user={user} onEdit={() => setEditParam("general")} />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="min-w-0 flex-1 gap-0 lg:min-h-0"
        >
          <div className="sticky top-14 z-4 shrink-0 bg-dashboard-background py-1 lg:static lg:py-0">
            <TabsList className="w-full flex-wrap justify-start rounded-xl border border-border p-1 group-data-horizontal/tabs:h-auto">
              {[
                { value: "overview", label: "Overview", icon: LayoutGrid },
                {
                  value: "orders",
                  label: "Orders",
                  icon: ShoppingBag,
                  count: user.orders.length,
                },
                {
                  value: "cart",
                  label: "Cart",
                  icon: ShoppingCart,
                  count: cartItems.length,
                },
                {
                  value: "sessions",
                  label: "Sessions",
                  icon: Monitor,
                  count: user.sessions.length,
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
            <UserOverview
              user={user}
              onViewOrders={() => handleTabChange("orders")}
            />
          </TabPanel>

          <TabPanel value="orders">
            <UserOrdersCard orders={user.orders} />
          </TabPanel>

          <TabPanel value="cart">
            <UserCartCard items={cartItems} />
          </TabPanel>

          <TabPanel value="sessions">
            <UserSessionsCard sessions={user.sessions} />
          </TabPanel>
        </Tabs>
      </main>
    </div>
  );
}
