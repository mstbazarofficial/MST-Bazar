import { Card } from "@/components/ui/card";
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
  const productHref = `/product/${product.slug}`;

  return (
    <Card
      className={cn(
        "border border-border/60 hover:border-primary/60 transition-all duration-200 shadow-xs hover:shadow-md rounded-md overflow-hidden p-3 sm:p-3.5 group relative",
        className,
      )}
    >
      <div className="flex items-center flex-col md:flex-row gap-2 h-full sm:gap-4 max-md:divide-y md:divide-x divide-border/50">
        {/* Left: Image Container */}
        <Link
          href={productHref}
          className="relative w-38 h-38 lg:w-56 lg:h-56 aspect-square shrink-0 rounded-md overflow-hidden bg-muted/30  flex items-center justify-center"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 112px, 144px"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center text-muted-foreground">
              <ShoppingBag className="w-8 h-8 stroke-[1.25]" />
            </div>
          )}
        </Link>

        {/* Right: Content & Actions */}
        <div className="flex-1 flex flex-col justify-between min-w-0 h-full w-full">
          <div className="flex-1 flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3 sm:my-4 max-sm:absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 rounded bg-rose-500 text-white px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold shadow-xs">
                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                Top Selling
              </span>

              {hasDiscount && (
                <span className="rounded bg-amber-500 text-white px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase shadow-xs">
                  {Math.round(product.discountPercentage!)}% OFF
                </span>
              )}
            </div>

            {/* Title & Unit */}
            <Link className="space-y-1 sm:space-y-3 " href={productHref}>
              <h3 className="font-bold text-xs sm:text-lg text-foreground/80 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {product.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {product.unit ? `(${product.unit})` : ""}
              </p>
            </Link>

            {/* Pricing */}
            <div className="flex items-baseline gap-1.5 mt-1.5 sm:mt-3">
              <span className="font-extrabold text-sm sm:text-lg text-primary">
                ৳{Math.round(finalPrice).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground/70 line-through font-medium">
                  ৳{Math.round(product.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-2.5 w-full sm:w-auto">
            <AddToCartButton product={product} productId={product.id} qty={1} />
          </div>
        </div>
      </div>
    </Card>
  );
}
