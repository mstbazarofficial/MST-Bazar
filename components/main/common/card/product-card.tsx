import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductDTO } from "@/lib/data/catalog";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  href,
  isList = false,
}: {
  product: ProductDTO;
  href: string;
  isList?: boolean;
}) {
  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  return (
    <Card className="border border-border/60 hover:border-primary/60 transition-all duration-200 shadow-xs hover:shadow-md rounded-md overflow-hidden flex flex-col justify-between group p-3 bg-card h-full gap-2 relative">
      {/* Top Image & Badge Container */}
      <Link
        href={href}
        className={cn("block", isList && "flex justify-between gap-3")}
      >
        <div
          className={cn(
            "relative w-full aspect-square bg-muted/30 rounded-sm overflow-hidden ",
            isList && "h-50 w-50",
          )}
        >
          {product.discountPercentage && (
            <span className="absolute top-2 left-2 bg-primary text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs z-10">
              {product.discountPercentage}% OFF
            </span>
          )}
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            loading="eager"
            src={product.images[0].url}
            alt={product.title}
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Middle Section: Title & Description (CardHeader) + Price (CardContent) */}

        <div
          className={cn(
            "flex flex-col pt-3 pb-2 space-y-2 ",
            isList && "flex-[0.8]",
          )}
        >
          {/* Title & Unit */}
          <CardHeader className="p-0 space-y-0.5">
            <CardTitle className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground font-normal">
              {product.unit}
            </CardDescription>
          </CardHeader>

          {/* Pricing */}
          <CardContent className="p-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-extrabold text-primary">
                ৳{discountedPrice.toFixed(2)}
              </span>
              {product.price && (
                <span className="text-xs text-muted-foreground/70 line-through font-medium">
                  ৳{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </CardContent>
        </div>
      </Link>

      {/* Bottom Action Area (CardFooter) */}
      <CardFooter
        className={cn("p-0 pt-1", isList && "absolute bottom-3 right-3")}
      >
        <AddToCartButton
          className={cn(isList && "w-56")}
          product={product}
          productId={product.id}
          qty={1}
        />
      </CardFooter>
    </Card>
  );
}
