import { StatTile } from "@/components/admin/orders/order-info/order-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { formatDate } from "@/utils/format-date";
import { formatExactPrice, formatPrice } from "@/utils/format-price";
import {
  CirclePlus,
  Monitor,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { getCartTotal } from "./user-cart-card";
import { UserOrdersCard } from "./user-orders-card";
import type { AdminUser } from "./user-sidebar";

const RECENT_ORDER_COUNT = 5;

export function UserOverview({
  user,
  onViewOrders,
}: {
  user: AdminUser;
  onViewOrders: () => void;
}) {
  const cartItems = user.cart?.items ?? [];
  const liveOrders = user.orders.filter(
    (order) => order.status !== "CANCELLED" && order.status !== "RETURNED",
  );
  const orderValue = liveOrders.reduce(
    (sum, order) => sum + calculateOrderTotal(order).finalTotal,
    0,
  );
  const closedCount = user.orders.length - liveOrders.length;

  // Orders and sessions both arrive newest first.
  const lastOrder = user.orders[0];
  const lastSession = user.sessions[0];

  const timeline = [
    { label: "Joined", date: user.createdAt, icon: CirclePlus },
    ...(lastOrder
      ? [{ label: "Last order", date: lastOrder.orderDate, icon: ShoppingBag }]
      : []),
    { label: "Last updated", date: user.updatedAt, icon: RefreshCw },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          icon={Wallet}
          iconClass="bg-blue-500/15 text-blue-700 dark:text-blue-400"
          label="Order value"
          value={formatPrice(orderValue)}
        >
          Excludes cancelled and returned
        </StatTile>
        <StatTile
          icon={ShoppingBag}
          iconClass="bg-violet-500/15 text-violet-700 dark:text-violet-400"
          label="Orders"
          value={String(user.orders.length)}
        >
          {closedCount} cancelled or returned
        </StatTile>
        <StatTile
          icon={ShoppingCart}
          iconClass="bg-amber-500/15 text-amber-700 dark:text-amber-400"
          label="Cart"
          value={formatExactPrice(getCartTotal(cartItems))}
        >
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </StatTile>
        <StatTile
          icon={Monitor}
          iconClass="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          label="Active sessions"
          value={String(user.sessions.length)}
        >
          {lastSession
            ? `Latest ${formatDate(lastSession.createdAt)}`
            : "None active"}
        </StatTile>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <UserOrdersCard
          orders={user.orders}
          title="Recent orders"
          limit={RECENT_ORDER_COUNT}
          onViewAll={onViewOrders}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex min-h-8 items-center text-base font-semibold">
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {timeline.map(({ label, date, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-muted/50 p-3"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(date)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
