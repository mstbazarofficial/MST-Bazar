// components/main/product/product-purchase-panel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { SITE_CONFIG } from "@/constants/site";
import { useCart, useCartItemError } from "@/context/cart-provider";
import {
  Check,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const DEFAULT_WHATSAPP_NUMBER = SITE_CONFIG.whatsapp;
const DEFAULT_PHONE_NUMBER = SITE_CONFIG.phone;

type PurchaseProduct = {
  id: string;
  title: string;
  shortDescription: string | null;
  discountPercentage: number;
  slug: string;
  images: {
    url: string;
    isFeatured: boolean;
  }[];
  price: number;
  unit: string | null;
  brand: string | null;
  category: {
    name: string;
    slug: string;
  };
};

type ProductPurchasePanelProps = {
  product: PurchaseProduct;
  whatsappNumber?: string;
  phoneNumber?: string;
};

export function ProductPurchasePanel({
  product,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
  phoneNumber = DEFAULT_PHONE_NUMBER,
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { addItem, items, updateQuantity } = useCart();
  const { error, clearError } = useCartItemError(product.id);
  const router = useRouter();

  // Check if the product is already in the cart
  const cartItem = items.find((i) => i.productId === product.id);
  const isInCart = !!cartItem;

  // Use cart quantity if present, otherwise fallback to local state
  const currentQty = isInCart ? cartItem.quantity : quantity;

  // Show toast ONLY on background sync error
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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, []);

  const handleDecrease = () => {
    if (isInCart) {
      // Prevents dropping below 1 from this UI (can use removeItem if needed)
      updateQuantity(product.id, Math.max(1, cartItem.quantity - 1));
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleIncrease = () => {
    if (isInCart) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const createCartItemPayload = () => ({
    title: product.title,
    slug: product.slug,
    price: product.price,
    discountPercentage: product.discountPercentage,
    unit: product.unit,
    image: product.images[0]?.url ?? null,
  });

  const handleAddToCart = () => {
    // Only dispatch addItem if it isn't already in the cart
    if (!isInCart) {
      addItem(createCartItemPayload(), product.id, currentQty);
    }

    setIsAdded(true);
    if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    revertTimerRef.current = setTimeout(() => {
      setIsAdded(false);
    }, 1400);
  };

  const handleBuyNow = () => {
    // Only add to cart if it's NOT already in the cart
    if (!isInCart) {
      addItem(createCartItemPayload(), product.id, currentQty);
    }
    router.push("/checkout");
  };

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello MST Bazar..!!,
I would like to place an order for this product.
Qty: ${currentQty}
Product Link: ${SITE_CONFIG.url}/product/${product.slug}`,
  )}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 pt-1">
        <label className="text-xs font-bold text-foreground">Quantity</label>
        <div className="flex items-center border border-border/70 bg-muted/30 rounded-xl overflow-hidden p-0.5">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={currentQty <= 1}
            className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-background rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-xs font-extrabold text-foreground">
            {currentQty}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-background rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3 w-full">
          <Button
            type="button"
            onClick={handleAddToCart}
            className={[
              "flex-1 h-11 font-extrabold text-xs sm:text-sm rounded-md gap-2 shadow-xs transition-all active:scale-98 cursor-pointer",
              isInCart || isAdded
                ? "bg-emerald-700 hover:bg-emerald-700 text-white"
                : "bg-primary hover:bg-emerald-600 text-white",
            ].join(" ")}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added ({cartItem.quantity})</span>
              </>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 h-11 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-md gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buy Now</span>
          </Button>
        </div>

        <div className="flex gap-3 w-full">
          <a
            target="_blank"
            href={whatsappHref}
            className="flex items-center justify-center h-11 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm rounded-md gap-2 shadow-xs transition-all active:scale-98 cursor-pointer flex-1"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span> Whatsapp</span>
          </a>
          <a
            target="_blank"
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center h-11 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs sm:text-sm rounded-md gap-2 shadow-xs transition-all active:scale-98 cursor-pointer flex-1"
          >
            <Phone className="w-4 h-4" />
            <span>Call to Order</span>
          </a>
        </div>
      </div>
    </div>
  );
}
