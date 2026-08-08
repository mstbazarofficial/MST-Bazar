// components/add-to-cart-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useCart, useCartItemError } from "@/context/cart-provider";
import { ProductDTO } from "@/lib/data/catalog";
import { AlertCircle, Check, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AddToCartButtonProps {
  product: ProductDTO;
  productId: string;
  qty?: number;
}

type Status = "idle" | "added" | "error";

const ADDED_DURATION_MS = 1400;
const ERROR_DURATION_MS = 2500;

export function AddToCartButton({
  product,
  productId,
  qty = 1,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { error, clearError } = useCartItemError(productId);

  const [status, setStatus] = useState<Status>("idle");
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRevert = (delay: number) => {
    if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    revertTimerRef.current = setTimeout(() => setStatus("idle"), delay);
  };

  // A background sync failure can arrive after we've already shown "Added".
  useEffect(() => {
    if (!error) return;
    setStatus("error");
    scheduleRevert(ERROR_DURATION_MS);
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, [error]);

  // Clear the error once we've finished displaying it, so it doesn't
  // resurface on the next unrelated render.
  useEffect(() => {
    if (status === "idle" && error) clearError();
  }, [status, error, clearError]);

  useEffect(() => {
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      title: product.title,
      slug: product.slug,
      price: product.price,
      discountPercentage: product.discountPercentage,
      unit: product.unit,
      image: product.images[0]?.url ?? null,
    };

    addItem(cartItem, productId, qty);

    setStatus("added");
  };
  const isError = status === "error";
  const isAdded = status === "added";

  return (
    <Button
      onClick={handleAddToCart}
      aria-live="polite"
      className={[
        "w-full py-1.5 pl-2 pr-4 rounded border font-semibold text-xs sm:text-sm flex justify-center gap-1.5 transition-all cursor-pointer active:scale-95",
        isError
          ? "border-destructive/60 bg-destructive/10 text-destructive hover:bg-destructive/10 hover:text-destructive"
          : isAdded
            ? "border-emerald-600/60 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
            : "border-primary/60 text-primary-foreground hover:bg-primary-dark hover:text-primary-foreground",
      ].join(" ")}
    >
      {isError ? (
        <>
          <AlertCircle className="w-3.5 h-3.5 stroke-3" />
          <span className="shrink-0 mt-1">{error}</span>
        </>
      ) : isAdded ? (
        <>
          <Check className="w-3.5 h-3.5 stroke-3" />
          <span className="shrink-0 mt-1">Added</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-3.5 h-3.5 stroke-3" />
          <span className="shrink-0 mt-1">Add to Cart</span>
        </>
      )}
    </Button>
  );
}
