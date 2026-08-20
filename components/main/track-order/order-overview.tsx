import { TrackedOrder } from "@/actions/main/track-order";
import { Calendar, CreditCard, Hash, MapPin, User } from "lucide-react";

const PAYMENT_LABELS: Record<string, string> = {
  CASH_ON_DELIVERY: "Cash on Delivery",
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  BANK_TRANSFER: "Bank Transfer",
  CARD: "Card",
  OTHER: "Other",
};

interface OrderOverviewProps {
  order: TrackedOrder;
}

export function OrderOverview({ order }: OrderOverviewProps) {
  const subtotal = order.orderItems.reduce((acc, item) => {
    const discounted = item.price * (1 - item.discountPercentage / 100);
    return acc + discounted * item.quantity;
  }, 0);

  const total = subtotal + order.shippingCost - order.discount;

  const placed = new Date(order.orderDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const items = [
    { icon: Hash, label: "Order ID", value: order.orderId, mono: true },
    { icon: Calendar, label: "Placed On", value: placed },
    {
      icon: CreditCard,
      label: "Payment",
      value:
        PAYMENT_LABELS[order.orderPaymentMethod] ?? order.orderPaymentMethod,
    },
    { icon: User, label: "Name", value: order.customerName },
    { icon: MapPin, label: "Address", value: order.fullAddress },
  ];

  return (
    <div>
      <h3 className="text-[0.8125rem] font-bold uppercase tracking-wider text-primary mb-4">
        Order Overview
      </h3>
      <div className="flex flex-col gap-3 mb-4">
        {items.map(({ icon: Icon, label, value, mono }) => (
          <div key={label} className="flex items-start gap-2.5">
            <span className="w-6.5 h-6.5 bg-accent text-accent-foreground rounded flex items-center justify-center shrink-0 mt-px">
              <Icon size={14} />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <span
                className={`text-sm font-semibold text-foreground break-all ${mono ? "font-mono tracking-tight" : ""}`}
              >
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-accent rounded-md p-2.5 text-[0.8125rem] font-semibold text-accent-foreground">
        <span>Order Total</span>
        <span className="text-base font-extrabold text-primary">
          ৳{total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
