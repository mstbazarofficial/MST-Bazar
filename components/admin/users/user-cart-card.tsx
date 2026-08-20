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

export function UserCartCard({ items }: { items: CartItemRow[] }) {
  const cartTotal = items.reduce((sum, item) => {
    const price =
      item.product.price * (1 - item.product.discountPercentage / 100);
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ShoppingCart className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Current Cart</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {items.length} item{items.length !== 1 ? "s" : ""} in cart
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <span className="text-sm font-bold text-foreground">
            ৳{cartTotal.toFixed(2)}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">Cart is empty.</p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {items.map((item) => {
            const featured =
              item.product.images.find((i) => i.isFeatured) ??
              item.product.images[0];
            const finalPrice =
              item.product.price * (1 - item.product.discountPercentage / 100);

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 px-5 py-3.5"
              >
                <div className="h-11 w-11 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                  {featured ? (
                    <Image
                      src={featured.url}
                      alt={item.product.title}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.product.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </span>
                    {item.product.discountPercentage > 0 && (
                      <>
                        <span className="text-muted-foreground/30 text-xs">
                          ·
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ৳{item.product.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                          -{item.product.discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <span className="text-sm font-bold text-foreground shrink-0">
                  ৳{(finalPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
