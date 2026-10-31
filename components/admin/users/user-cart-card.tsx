import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUnitPrice } from "@/utils/calculate-order-total";
import { formatExactPrice } from "@/utils/format-price";
import { Package, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface CartItemRow {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    discountPercentage: number;
    images: { url: string; isFeatured: boolean }[];
  };
}

export function getCartTotal(items: CartItemRow[]) {
  return items.reduce((sum, item) => {
    const price = getUnitPrice(
      item.product.price,
      item.product.discountPercentage,
    );
    return sum + price * item.quantity;
  }, 0);
}

export function UserCartCard({ items }: { items: CartItemRow[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex min-h-8 items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Current cart</CardTitle>
          {items.length > 0 && (
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {formatExactPrice(getCartTotal(items))}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center text-muted-foreground">
            <ShoppingCart className="size-5" />
            <p className="text-sm">Cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const featured =
                item.product.images.find((i) => i.isFeatured) ??
                item.product.images[0];
              const finalPrice = getUnitPrice(
                item.product.price,
                item.product.discountPercentage,
              );

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-muted/50 p-3"
                >
                  <div className="size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    {featured ? (
                      <Image
                        src={featured.url}
                        alt={item.product.title}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="size-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.product.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.quantity} × {formatExactPrice(finalPrice)}
                      {item.product.discountPercentage > 0 &&
                        ` · ${item.product.discountPercentage}% off`}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm text-foreground tabular-nums">
                    {formatExactPrice(finalPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
