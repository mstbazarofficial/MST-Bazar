import { Star } from "lucide-react";
import type { ReactNode } from "react";

type ProductInfoGridProps = {
  product: {
    sku: string | null;
    brand: string | null;
    categoryName: string;
    unit: string | null;
    price: number;
    discountPercentage: number;
    isBestDeal: boolean;
    slug: string;
  };
};

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
}

export function ProductInfoGrid({ product }: ProductInfoGridProps) {
  const finalPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  const rows: { label: string; value: ReactNode }[] = [
    { label: "SKU", value: product.sku ?? "—" },
    { label: "Brand", value: product.brand ?? "—" },
    { label: "Category", value: product.categoryName },
    { label: "Unit", value: product.unit ?? "—" },
    { label: "Price", value: formatCurrency(product.price) },
    {
      label: "Discount",
      value:
        product.discountPercentage > 0 ? `${product.discountPercentage}%` : "—",
    },
    { label: "Final Price", value: formatCurrency(finalPrice) },
    {
      label: "Best Deal",
      value: product.isBestDeal ? (
        <Star className="size-4 fill-amber-400 text-amber-400" />
      ) : (
        "—"
      ),
    },
    { label: "Slug", value: product.slug },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            {row.label}
          </p>
          <div className="text-sm font-medium text-foreground">{row.value}</div>
        </div>
      ))}
    </div>
  );
}
