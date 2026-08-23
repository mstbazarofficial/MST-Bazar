// components/main/product/product-info.tsx
import {
  Leaf,
  ShieldCheck,
  Sparkles,
  Store,
  type LucideIcon,
} from "lucide-react";
import { ProductPurchasePanel } from "./product-purchase-panel";

type ProductInfoProduct = {
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

type ProductInfoProps = {
  product: ProductInfoProduct;
};

type HighlightFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const HIGHLIGHT_FEATURES: HighlightFeature[] = [
  { icon: Leaf, title: "100% Authentic", description: "No Additives" },
  { icon: ShieldCheck, title: "Lab Tested", description: "Quality Assured" },
  { icon: Sparkles, title: "Premium Grade", description: "Naturally Sourced" },
  { icon: Store, title: "Direct Sourced", description: "Trusted Suppliers" },
];

function formatTaka(amount: number) {
  return `৳${amount.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { title, shortDescription, discountPercentage, price, unit, brand } =
    product;

  const hasDiscount = discountPercentage > 0;

  // Calculate the discounted selling price from base price
  const finalPrice = hasDiscount
    ? Math.round(price * (1 - discountPercentage / 100))
    : price;

  const originalPrice = price;

  return (
    <div className="space-y-4">
      {/* Brand & Title */}
      <div className="space-y-2">
        {brand && (
          <span className="text-xs font-bold tracking-[0.25em] text-primary-dark uppercase">
            {brand}
          </span>
        )}
        <h1 className="flex flex-wrap items-center gap-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
          {unit && (
            <span className="rounded-md bg-muted/70 px-2 py-0.5 text-sm font-medium tracking-normal text-muted-foreground">
              {unit}
            </span>
          )}
        </h1>
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-end gap-x-3 gap-y-1 border-b border-border/70 pb-4">
        {/* Current / Discounted Price */}
        <span className="text-xl font-bold text-primary-dark sm:text-2xl">
          {formatTaka(finalPrice)}
        </span>

        {/* Original Price & Discount Tag */}
        {hasDiscount && (
          <div className="mb-1 flex items-center gap-2">
            <span className="text-base font-normal text-muted-foreground/70 line-through">
              {formatTaka(originalPrice)}
            </span>
            <span className="rounded-md bg-orange-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {Math.round(discountPercentage)}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
        <p className="mb-1 font-bold text-foreground">Description</p>
        <p>
          {shortDescription || "No description available for this product."}
        </p>
      </div>

      {/* Purchase actions — quantity, cart, and direct order channels */}
      <ProductPurchasePanel product={product} />

      {/* Highlight Features */}
      <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
        {HIGHLIGHT_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex items-center gap-2.5 rounded-md border border-border/40 bg-muted/30 p-2.5"
          >
            <feature.icon className="h-5 w-5 shrink-0 stroke-[1.8] text-primary" />
            <div className="min-w-0">
              <h4 className="truncate text-[11px] font-bold leading-tight text-foreground">
                {feature.title}
              </h4>
              <p className="truncate text-[10px] leading-tight text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
