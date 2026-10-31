"use client";

import { toast } from "@/components/ui/toast";
import { MAX_ITEM_QTY } from "@/constants/site";
import { getUnitPrice } from "@/utils/calculate-order-total";
import { formatPrice } from "@/utils/format-price";
import { ChevronDown, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { PopulatedCartItem } from "@/actions/main/cart-actions";
import type { AppliedPromo } from "@/actions/main/promo-actions";
import { useCart } from "@/context/cart-provider";
import { cn } from "@/lib/utils";
import { PromoCodeField } from "./promo-code-field";

interface OrderSummaryProps {
  items: PopulatedCartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  appliedPromo: AppliedPromo | null;
  promoDiscount: number;
  onApplyPromo: (promo: AppliedPromo) => void;
  onRemovePromo: () => void;
}

function getDiscountedPrice(product: PopulatedCartItem["product"]) {
  return getUnitPrice(product.price, product.discountPercentage);
}

export function OrderSummary({
  items,
  subtotal,
  deliveryCharge,
  total,
  appliedPromo,
  promoDiscount,
  onApplyPromo,
  onRemovePromo,
}: OrderSummaryProps) {
  const { updateQuantity, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(true);

  // Out of stock items block the order, so they must not stay collapsed away.
  const hasUnavailableItem = items.some((item) => !item.product.isAvailable);
  const showDetails = isOpen || hasUnavailableItem;

  const handleIncrease = (item: PopulatedCartItem) => {
    if (item.quantity >= MAX_ITEM_QTY) {
      toast.add({
        title: `You can order at most ${MAX_ITEM_QTY} units of this item.`,
        type: "error",
      });
      return;
    }
    updateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrease = (item: PopulatedCartItem) => {
    if (item.quantity <= 1) return;
    updateQuantity(item.productId, item.quantity - 1);
  };

  const handleRemove = (item: PopulatedCartItem) => {
    removeItem(item.productId);
    toast.add({
      title: `${item.product.title} removed from cart.`,
      type: "success",
    });
  };

  return (
    <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs space-y-4 sm:p-5">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={showDetails}
        className="flex w-full cursor-pointer items-center justify-between gap-3 lg:hidden"
      >
        <span className="flex items-center gap-1.5 text-sm font-extrabold text-foreground">
          Order Summary ({items.length})
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              showDetails && "rotate-180",
            )}
          />
        </span>
        <span className="text-base font-black text-emerald-800">
          {formatPrice(total)}
        </span>
      </button>

      <h3 className="hidden border-b pb-3.5 text-base font-bold tracking-tight text-foreground lg:block">
        Order Summary ({items.length})
      </h3>

      {/* The height cap keeps Place Order on screen on short laptop displays. */}
      <div
        className={cn(
          "divide-y divide-border/60 lg:block lg:max-h-[max(11rem,calc(100dvh-28rem))] lg:overflow-y-auto lg:pr-1",
          !showDetails && "max-lg:hidden",
        )}
      >
        {items.map((item) => {
          const discountedPrice = getDiscountedPrice(item.product);

          return (
            <div
              key={item.productId}
              className="flex gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border bg-muted/30">
                {item.product.image && (
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
                      {item.product.title}
                    </h4>
                    {!item.product.isAvailable && (
                      <p className="text-xs font-bold text-destructive">
                        Out of stock
                      </p>
                    )}
                    {item.quantity > 1 && (
                      <p className="text-xs font-medium text-muted-foreground">
                        {formatPrice(discountedPrice)} each
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="-mt-1 -mr-1 shrink-0 cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600"
                    title="Remove item"
                    aria-label={`Remove ${item.product.title} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-border/80 bg-background">
                    <button
                      type="button"
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1}
                      className="flex size-8 cursor-pointer items-center justify-center text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Decrease quantity of ${item.product.title}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-7 text-center text-sm font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIncrease(item)}
                      className="flex size-8 cursor-pointer items-center justify-center text-foreground transition-all hover:bg-muted"
                      aria-label={`Increase quantity of ${item.product.title}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="truncate text-base font-black text-emerald-800">
                    {formatPrice(discountedPrice * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PromoCodeField
        applied={appliedPromo}
        subtotal={subtotal}
        onApply={onApplyPromo}
        onRemove={onRemovePromo}
      />

      <div className="border-t border-border/60 pt-4 space-y-2 text-sm font-semibold">
        <div className="flex justify-between text-foreground">
          <span>Subtotal</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-foreground">
          <span>Delivery Charge</span>
          <span className="font-bold">{formatPrice(deliveryCharge)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-emerald-800">
            <span>Discount ({appliedPromo?.code})</span>
            <span className="font-bold">-{formatPrice(promoDiscount)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border/60 pt-4 flex items-center justify-between">
        <span className="text-base font-extrabold text-foreground">
          Total Amount
        </span>
        <span className="text-2xl font-black text-emerald-800 tracking-wide">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}
