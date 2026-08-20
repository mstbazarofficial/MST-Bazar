import { TrackedOrder } from "@/actions/main/track-order";
import { BadgeCheck, ShoppingBag, Tag, Truck } from "lucide-react";

interface OrderSummaryProps {
  order: TrackedOrder;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const subtotal = order.orderItems.reduce((acc, item) => {
    const discounted = item.price * (1 - item.discountPercentage / 100);
    return acc + discounted * item.quantity;
  }, 0);

  const total = subtotal + order.shippingCost - order.discount;

  const rows = [
    {
      icon: ShoppingBag,
      label: "Subtotal",
      value: `৳${subtotal.toFixed(2)}`,
      valueClass: "font-semibold text-foreground",
    },
    {
      icon: Tag,
      label: "Discount",
      value: order.discount > 0 ? `-৳${order.discount.toFixed(2)}` : "—",
      valueClass:
        order.discount > 0
          ? "font-semibold text-primary"
          : "text-muted-foreground",
    },
    {
      icon: Truck,
      label: "Shipping",
      value:
        order.shippingCost > 0 ? `৳${order.shippingCost.toFixed(2)}` : "Free",
      valueClass:
        order.shippingCost === 0
          ? "font-bold text-primary"
          : "font-semibold text-foreground",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <h3 className="text-[0.8125rem] font-bold uppercase tracking-wider text-primary mb-4">
        Price Summary
      </h3>
      <div className="flex flex-col gap-2.5">
        {rows.map(({ icon: Icon, label, value, valueClass }) => (
          <div
            key={label}
            className="flex items-center justify-between text-sm text-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Icon size={14} className="opacity-70" />
              {label}
            </span>
            <span className={valueClass}>{value}</span>
          </div>
        ))}

        <div className="h-[1.5px] bg-border my-1.5" />

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-[0.9375rem] text-foreground">
            <BadgeCheck size={16} className="text-primary" />
            Total Payable
          </span>
          <span className="text-lg font-extrabold text-primary">
            ৳{total.toFixed(2)}
          </span>
        </div>
      </div>

      {order.TrxNumber && (
        <p className="mt-3.5 pt-3 text-[0.78rem] text-muted-foreground border-t border-dashed border-border">
          Transaction Ref:{" "}
          <span className="font-mono tracking-tight">{order.TrxNumber}</span>
        </p>
      )}
    </div>
  );
}
