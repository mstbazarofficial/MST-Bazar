"use client";

import { toast } from "@/components/ui/toast";
import {
  Check,
  CheckCircle2,
  Copy,
  LayoutDashboard,
  Mail,
  PackageSearch,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

export interface PlacedOrder {
  orderId: string;
  email: string;
  phone: string;
  total: number;
}

interface OrderSuccessDialogProps {
  order: PlacedOrder | null;
  onOpenChange: (open: boolean) => void;
}

export function OrderSuccessDialog({
  order,
  onOpenChange,
}: OrderSuccessDialogProps) {
  const [copied, setCopied] = useState(false);
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  const handleCopyOrderId = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      toast.add({
        title: "Order ID copied to clipboard",
        type: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.add({
        title: "Couldn't copy the order ID. Please copy it manually.",
        type: "error",
      });
    }
  };

  const trackOrderHref = order
    ? `/track-order?orderId=${encodeURIComponent(order.orderId)}&phone=${encodeURIComponent(order.phone)}`
    : "/track-order";

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckCircle2 className="h-7 w-7 stroke-[2.5]" />
          </div>
          <DialogTitle className="text-xl font-black text-foreground">
            Your order is placed!
          </DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Thanks for shopping with us. Please save your order ID below to
            track your order later.
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="space-y-4">
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

            <div className="flex items-start gap-2 text-[11px] font-medium leading-relaxed text-muted-foreground">
              <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
              <p>
                A confirmation email with your order details is on its way to{" "}
                <span className="font-bold text-foreground">{order.email}</span>
                . Keep the order ID handy — you&apos;ll need it to track your
                order.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {isAuthenticated ? (
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
