"use client";

import { toast } from "@/components/ui/toast";
import { Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import Image from "next/image";

import type { PopulatedCartItem } from "@/actions/main/cart-actions";
import { useCart } from "@/context/cart-provider";
import { cn } from "@/lib/utils";

const MAX_QTY = 10;

interface OrderSummaryProps {
  items: PopulatedCartItem[];
  isSelected: (productId: string) => boolean;
  onToggleSelect: (productId: string) => void;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
  selectedCount: number;
  subtotal: number;
  deliveryCharge: number;
  total: number;
}

function getDiscountedPrice(product: PopulatedCartItem["product"]) {
  const discount = product.price * ((product.discountPercentage ?? 0) / 100);
  return product.price - discount;
}

/**
 * Floors the price to strip cents/decimals and formats with 2 fixed decimals (e.g., 110.12 -> 110.00).
 */
function formatPrice(amount: number) {
  return Math.floor(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function OrderSummary({
  items,
  isSelected,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  selectedCount,
  subtotal,
  deliveryCharge,
  total,
}: OrderSummaryProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrease = (item: PopulatedCartItem) => {
    if (item.quantity >= MAX_QTY) {
      toast.add({
        title: `You can order at most ${MAX_QTY} units of this item.`,
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
    <div className="space-y-4">
      <div className="bg-card border border-primary/60 rounded-md p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="select-all"
              checked={items.length > 0 && isAllSelected}
              onChange={onToggleSelectAll}
              className="w-4 h-4 rounded border-border text-emerald-700 focus:ring-emerald-600 cursor-pointer accent-emerald-700 shrink-0"
            />
            <label
              htmlFor="select-all"
              className="text-xs font-bold text-foreground cursor-pointer"
            >
              Select All ({selectedCount}/{items.length})
            </label>
          </div>
          <h3 className="text-sm font-extrabold text-foreground">
            Order Summary
          </h3>
        </div>

        <div className="space-y-3.5 lg:max-h-95 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <p className="text-xs text-center text-muted-foreground py-6">
              Your cart is empty.
            </p>
          ) : (
            items.map((item) => {
              const selected = isSelected(item.productId);
              const discountedPrice = getDiscountedPrice(item.product);

              return (
                <div
                  key={item.productId}
                  className={cn(
                    "flex items-center gap-2.5 p-2 rounded-sm border transition-all",
                    selected
                      ? "border-emerald-600/40 bg-emerald-50/10"
                      : "border-border/40 opacity-60",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelect(item.productId)}
                    className="w-4 h-4 rounded border-border text-emerald-700 focus:ring-emerald-600 cursor-pointer accent-emerald-700 shrink-0"
                  />

                  <div className="relative w-12 h-12 rounded-lg bg-amber-500/10 overflow-hidden shrink-0 border border-primary/40">
                    {item.product.image && (
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      ৳{formatPrice(discountedPrice)}
                    </p>
                    <p className="text-xs font-black text-emerald-800 pt-0.5">
                      ৳{formatPrice(discountedPrice * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center border border-border/80 rounded-lg bg-background overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1}
                      className="p-1 hover:bg-muted text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                      aria-label={`Decrease quantity of ${item.product.title}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-foreground min-w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIncrease(item)}
                      className="p-1 hover:bg-muted text-foreground transition-all cursor-pointer"
                      aria-label={`Increase quantity of ${item.product.title}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer shrink-0"
                    title="Remove item"
                    aria-label={`Remove ${item.product.title} from cart`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-border/60 pt-4 space-y-2 text-xs font-semibold">
          <div className="flex justify-between text-foreground">
            <span>Selected Items Subtotal</span>
            <span className="font-bold">৳{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-foreground">
            <span>Delivery Charge</span>
            <span className="font-bold">৳{formatPrice(deliveryCharge)}</span>
          </div>
        </div>

        <div className="border-t border-border/60 pt-4 flex items-center justify-between">
          <span className="text-sm font-extrabold text-foreground">
            Total Amount
          </span>
          <span className="text-2xl font-black text-emerald-800 tracking-wide">
            ৳{formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/60 rounded-md p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 stroke-2" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-emerald-900">
            100% Secure Checkout
          </h4>
          <p className="text-[11px] text-emerald-700/80 font-medium">
            Your information is safe with us
          </p>
        </div>
      </div>
    </div>
  );
}
