import { Card } from "@/components/ui/card";
import { ProductDTO } from "@/lib/data/catalog";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({
  product,
  href,
  isList = false,
}: {
  product: ProductDTO;
  href: string;
  isList?: boolean;
}) {
  const discountedPrice = product.discountPercentage
    ? product.price - (product.price * product.discountPercentage) / 100
    : product.price;

  // 1. List View Rendering
  if (isList) {
    return (
      <Card className="border border-border/60 hover:border-primary/60 transition-all duration-200 shadow-xs hover:shadow-md rounded-md overflow-hidden bg-card p-3 sm:p-3.5 group">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
          <Link
            href={href}
            className="flex items-start gap-3.5 flex-1 min-w-0 w-full"
          >
            {/* Compact Image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-muted/30 rounded-md overflow-hidden shrink-0 border border-border/40">
              {!!product.discountPercentage && (
                <span className="absolute top-1 left-1 bg-primary text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs z-10">
                  {product.discountPercentage}% OFF
                </span>
              )}
              {product.isCombo && (
                <span className="absolute top-1 right-1 bg-amber-600 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs z-10 uppercase tracking-wider">
                  Combo
                </span>
              )}
              <Image
                fill
                sizes="96px"
                src={product.images[0].url}
                alt={product.title}
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Title, Unit & Price */}
            <div className="flex flex-col min-w-0 flex-1 space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <p className="text-[11px] text-muted-foreground font-medium">
                {product.unit}
              </p>
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-sm sm:text-base font-extrabold text-primary">
                  ৳{discountedPrice.toFixed(2)}
                </span>
                {!!product.discountPercentage && (
                  <span className="text-xs text-muted-foreground/70 line-through font-medium">
                    ৳{product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Action Button */}
          <div className="w-full sm:w-44 shrink-0 sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
            <AddToCartButton product={product} productId={product.id} qty={1} />
          </div>
        </div>
      </Card>
    );
  }

  // 2. Grid View Rendering
  return (
    <Card className="border border-border/60 hover:border-primary/60 transition-all duration-200 shadow-xs hover:shadow-md rounded-md overflow-hidden flex flex-col justify-between group p-3 bg-card h-full gap-2 relative">
      <Link href={href} className="block space-y-2">
        {/* Square Image */}
        <div className="relative w-full aspect-square bg-muted/30 rounded-sm overflow-hidden">
          {!!product.discountPercentage && (
            <span className="absolute top-2 left-2 bg-primary text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs z-10">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isCombo && (
            <span className="absolute top-2 right-2 bg-amber-600 text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs z-10 uppercase tracking-wider">
              Combo
            </span>
          )}
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={product.images[0].url}
            alt={product.title}
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Title, Unit & Price */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-[11px] text-muted-foreground font-normal">
            {product.unit}
          </p>
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-sm sm:text-base font-extrabold text-primary">
              ৳{discountedPrice.toFixed(2)}
            </span>
            {!!product.discountPercentage && (
              <span className="text-xs text-muted-foreground/70 line-through font-medium">
                ৳{product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Button */}
      <div className="pt-1">
        <AddToCartButton product={product} productId={product.id} qty={1} />
      </div>
    </Card>
  );
}
