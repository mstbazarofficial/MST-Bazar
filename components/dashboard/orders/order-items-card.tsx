import { Panel } from "@/components/dashboard/layout/dashboard-panel";
import { getUnitPrice } from "@/utils/calculate-order-total";
import { formatExactPrice } from "@/utils/format-price";
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
    <Panel title={`Items (${items.length})`}>
      <div className="divide-y divide-border border-t border-border">
        {items.map((item) => {
          const finalPrice = getUnitPrice(item.price, item.discountPercentage);
          const lineTotal = finalPrice * item.quantity;

          return (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <div className="size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={56}
                    height={56}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Package className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.productName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                  {item.quantity} × {formatExactPrice(finalPrice)}
                  {item.discountPercentage > 0 && (
                    <>
                      {" "}
                      <span className="line-through">
                        {formatExactPrice(item.price)}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <p className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                {formatExactPrice(lineTotal)}
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
