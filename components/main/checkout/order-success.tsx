"use client";

import {
  Check,
  CheckCircle2,
  Copy,
  LayoutDashboard,
  Mail,
  PackageSearch,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { formatPrice } from "@/utils/format-price";
import { PurchaseConfirmTracker } from "./purchase-confirm-tracker";

const PLACED_ORDER_KEY = "placed_order_v1";

export interface PlacedOrder {
  orderId: string;
  email: string;
  phone: string;
  total: number;
  metaEventId: string;
  items: { id: string; quantity: number }[];
}

/** Kept in the tab rather than the URL, so the phone number stays out of links and history. */
export function savePlacedOrder(order: PlacedOrder) {
  sessionStorage.setItem(PLACED_ORDER_KEY, JSON.stringify(order));
}

const subscribe = () => () => {};

export function OrderSuccess() {
  // undefined until hydrated, null when this tab has no placed order.
  const stored = useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem(PLACED_ORDER_KEY),
    () => undefined,
  );
  const order = useMemo<PlacedOrder | null>(
    () => (stored ? JSON.parse(stored) : null),
    [stored],
  );
  const trackedItems = useMemo(
    () => order?.items.map((item) => ({ id: item.id, qty: item.quantity })),
    [order],
  );

  const { data: session } = authClient.useSession();
  const [copied, setCopied] = useState(false);

  if (stored === undefined) {
    return <Skeleton className="mx-auto h-80 w-full max-w-md rounded-xl" />;
  }

  if (!order || !trackedItems) {
    return (
      <div className="mx-auto max-w-md rounded-xl border bg-card p-8 text-center shadow-xs">
        <h2 className="text-lg font-bold text-foreground">
          No recent order to show
        </h2>
        <p className="mt-1.5 text-xs font-medium text-muted-foreground">
          You can look up an order with its ID and your phone number.
        </p>
        <Button
          render={<Link href="/track-order" />}
          nativeButton={false}
          className="mt-5"
        >
          Track An Order
        </Button>
      </div>
    );
  }

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      toast.add({ title: "Order ID copied to clipboard", type: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.add({
        title: "Couldn't copy the order ID. Please copy it manually.",
        type: "error",
      });
    }
  };

  const trackOrderHref = `/track-order?orderId=${encodeURIComponent(order.orderId)}&phone=${encodeURIComponent(order.phone)}`;

  return (
    <div className="mx-auto max-w-md space-y-5 rounded-xl border bg-card p-6 shadow-xs">
      <PurchaseConfirmTracker
        orderId={order.orderId}
        eventId={order.metaEventId}
        value={order.total}
        items={trackedItems}
      />

      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
          <CheckCircle2 className="h-7 w-7 stroke-[2.5]" />
        </div>
        <h2 className="text-xl font-black text-foreground">
          Your order is placed!
        </h2>
        <p className="mt-1 text-xs font-medium text-muted-foreground">
          Thanks for shopping with us. Please save your order ID to track your
          order later.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-md border border-primary/20 bg-primary/5 p-3.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Order ID
          </p>
          <p className="truncate text-base font-black tracking-wide text-emerald-800 dark:text-emerald-400">
            {order.orderId}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopyOrderId}
          aria-label="Copy Order ID"
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-primary/20 bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-xs transition-colors hover:bg-muted"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-sm font-bold text-foreground">
        <span>Order Total</span>
        <span>{formatPrice(order.total)}</span>
      </div>

      {order.email && (
        <div className="flex items-start gap-2 text-[11px] font-medium leading-relaxed text-muted-foreground">
          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
          <p>
            A confirmation email is on its way to{" "}
            <span className="font-bold text-foreground">{order.email}</span>.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {session?.user ? (
          <Button
            render={<Link href="/dashboard/orders" />}
            nativeButton={false}
            className="w-full justify-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            View In My Dashboard
          </Button>
        ) : (
          <Button
            render={<Link href={trackOrderHref} />}
            nativeButton={false}
            className="w-full justify-center gap-2"
          >
            <PackageSearch className="h-4 w-4" />
            Track My Order
          </Button>
        )}
        <Button
          render={<Link href="/products" />}
          nativeButton={false}
          variant="outline"
          className="w-full justify-center"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
