import { ProductDTO } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";
import { Flame, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";

export function TopSellingProductCard({
  product,
  className,
}: {
  product: ProductDTO;
  className?: string;
}) {
  const hasDiscount =
    product.discountPercentage != null && product.discountPercentage > 0;

  const finalPrice = hasDiscount
    ? product.price * (1 - product.discountPercentage! / 100)
    : product.price;

  const imageUrl = product.images?.[0]?.url;

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 sm:gap-5 bg-card rounded-2xl border border-border/60 hover:border-primary/60 p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300",
        className,
      )}
    >
      {/* Left: Clean Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-32 sm:w-40 aspect-square shrink-0 rounded-xl overflow-hidden bg-muted/20 flex items-center justify-center"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 128px, 160px"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center text-muted-foreground">
            <ShoppingBag className="w-8 h-8 stroke-[1.25]" />
          </div>
        )}
      </Link>

      {/* Right: Content & Actions */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Badges Before Name */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 text-white px-2 py-0.5 text-[9px] sm:text-[10px] font-bold shadow-xs">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              Top Selling
            </span>

            {hasDiscount && (
              <span className="rounded-md bg-amber-500 text-white px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase shadow-xs">
                {Math.round(product.discountPercentage!)}% OFF
              </span>
            )}
          </div>

          {/* Title & Unit */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {product.title} {product.unit ? `(${product.unit})` : ""}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="font-extrabold text-base sm:text-lg text-amber-600 dark:text-amber-500">
              ৳{Math.round(finalPrice).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through font-medium">
                ৳{Math.round(product.price).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-3 w-full sm:w-auto">
          <AddToCartButton product={product} productId={product.id} qty={1} />
        </div>
      </div>
    </div>
  );
}
