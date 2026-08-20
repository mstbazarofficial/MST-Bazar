import { TrackedOrder } from "@/actions/main/track-order";
import { Package } from "lucide-react";
import Image from "next/image";

interface OrderItemsProps {
  items: TrackedOrder["orderItems"];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div>
      <h3 className="text-[0.8125rem] font-bold uppercase tracking-wider text-primary mb-4">
        Items Ordered
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const discountedPrice =
            item.price * (1 - item.discountPercentage / 100);
          const lineTotal = discountedPrice * item.quantity;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 pb-3 border-b border-border last:border-b-0 last:pb-0"
            >
              {/* Image */}
              <div className="w-13 h-13 rounded border border-border overflow-hidden relative shrink-0 bg-muted">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-muted-foreground">
                    <Package size={22} />
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground mb-1 truncate">
                  {item.productName}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </span>
                  {item.discountPercentage > 0 && (
                    <>
                      <span className="text-[0.72rem] text-muted-foreground line-through">
                        ৳{item.price.toFixed(2)}
                      </span>
                      <span className="text-[0.68rem] font-bold bg-accent text-accent-foreground rounded-full px-2 py-0.5">
                        -{item.discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <span className="block text-[0.9375rem] font-bold text-foreground">
                  ৳{lineTotal.toFixed(2)}
                </span>
                {item.discountPercentage > 0 && (
                  <span className="text-[0.7rem] text-muted-foreground">
                    ৳{discountedPrice.toFixed(2)} each
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
