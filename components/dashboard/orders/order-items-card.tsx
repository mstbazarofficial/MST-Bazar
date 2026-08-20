import { Package } from "lucide-react";
import Image from "next/image";

interface OrderItem {
  id: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  price: number;
  discountPercentage: number;
}

interface OrderItemsCardProps {
  items: OrderItem[];
}

export function OrderItemsCard({ items }: OrderItemsCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <h2 className="text-sm font-bold text-foreground">
          Items Ordered{" "}
          <span className="text-muted-foreground font-normal">
            ({items.length})
          </span>
        </h2>
      </div>

      <div className="divide-y divide-border/60">
        {items.map((item) => {
          const finalPrice = item.price * (1 - item.discountPercentage / 100);
          const lineTotal = finalPrice * item.quantity;

          return (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              {/* Image */}
              <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight truncate">
                  {item.productName}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </span>
                  {item.discountPercentage > 0 && (
                    <>
                      <span className="text-muted-foreground/30 text-xs">
                        ·
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ৳{item.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        -{item.discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Line total */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">
                  ৳{lineTotal.toFixed(2)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    ৳{finalPrice.toFixed(2)} each
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
