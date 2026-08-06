"use client";

import type { PopulatedCartItem } from "@/actions/main/cart-actions";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import { useCart, useCartItemError } from "@/context/cart-provider";
import { formatPrice } from "@/utils/format-price";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export function CartSheet() {
  const { items, isLoading, totalItems, totalPrice } = useCart();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label="Open cart"
            className="flex cursor-pointer flex-col items-center gap-0.5 px-1 text-foreground transition-colors hover:text-primary"
          >
            <span className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </span>
            <span className="text-xs font-medium">Cart</span>
          </button>
        }
      />

      {/* hide the built-in X close button so only our custom one shows */}
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md *:data-[slot=sheet-close]:hidden"
      >
        <SheetHeader className="flex-row items-center justify-between border-b py-4 pl-5 pr-4">
          <SheetTitle>
            Your Cart{totalItems > 0 && ` (${totalItems})`}
          </SheetTitle>

          <SheetClose
            render={
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Close
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          />
        </SheetHeader>

        <ScrollArea className="flex-1 px-5">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <CartRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="space-y-3 border-t bg-background px-5 py-4">
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <SheetClose
              nativeButton={false}
              render={
                <Link href="/checkout" className="block w-full">
                  <Button className="w-full" size="lg">
                    Checkout
                  </Button>
                </Link>
              }
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartRow({ item }: { item: PopulatedCartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const { error, clearError } = useCartItemError(item.productId);

  useEffect(() => {
    if (error) {
      toast.add({
        title: "Couldn't update cart",
        description: error,
        type: "error",
      });
      clearError();
    }
  }, [error, clearError]);

  const hasDiscount = item.product.discountPercentage > 0;
  const unitPrice = hasDiscount
    ? item.product.price * (1 - item.product.discountPercentage / 100)
    : item.product.price;
  const lineTotal = unitPrice * item.quantity;

  return (
    <li className="flex gap-3 py-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.product.slug}`}
            className="line-clamp-2 text-sm font-medium leading-tight hover:text-primary"
          >
            {item.product.title}
          </Link>
          <button
            type="button"
            aria-label="Remove item"
            onClick={() => removeItem(item.productId)}
            className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {item.product.unit && (
            <span className="text-xs text-muted-foreground">
              {item.product.unit}
            </span>
          )}
          {item.product.unit && hasDiscount && (
            <span className="text-xs text-muted-foreground">·</span>
          )}
          {hasDiscount && (
            <span className="text-xs text-muted-foreground">
              {formatPrice(unitPrice)} each
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-end justify-between">
          <div className="flex items-center rounded-full border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-accent"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= 10}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-right">
            {hasDiscount && (
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            )}
            <div className="text-sm font-semibold">
              {formatPrice(lineTotal)}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function EmptyCart() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
      <ShoppingCart
        className="h-10 w-10 text-muted-foreground"
        strokeWidth={1.5}
      />
      <h3 className="text-sm font-medium">Your cart is empty</h3>
      <p className="text-xs text-muted-foreground">
        Add some groceries to get started
      </p>
    </div>
  );
}
