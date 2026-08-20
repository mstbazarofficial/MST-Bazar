import { PaymentMethod } from "@/generated/prisma/enums";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH_ON_DELIVERY: "Cash on Delivery",
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  BANK_TRANSFER: "Bank Transfer",
  CARD: "Card",
  OTHER: "Other",
};

interface OrderSummaryCardProps {
  orderPaymentMethod: PaymentMethod;
  TrxNumber?: string | null;
  TrxID?: string | null;
  shippingCost: number;
  discount: number;
  orderItems: {
    price: number;
    quantity: number;
    discountPercentage: number;
  }[];
}

function SummaryRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  );
}

export function OrderSummaryCard({
  orderPaymentMethod,
  TrxNumber,
  TrxID,
  shippingCost,
  discount,
  orderItems,
}: OrderSummaryCardProps) {
  const subtotal = orderItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const itemDiscount = orderItems.reduce((sum, item) => {
    return sum + item.price * (item.discountPercentage / 100) * item.quantity;
  }, 0);

  const total = subtotal - itemDiscount + shippingCost - discount;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <h2 className="text-sm font-bold text-foreground">Payment Summary</h2>
      </div>

      <div className="px-5 py-4 space-y-2.5">
        <SummaryRow label="Subtotal" value={`৳${subtotal.toFixed(2)}`} />
        {itemDiscount > 0 && (
          <SummaryRow
            label="Item discount"
            value={`-৳${itemDiscount.toFixed(2)}`}
          />
        )}
        {discount > 0 && (
          <SummaryRow
            label="Order discount"
            value={`-৳${discount.toFixed(2)}`}
          />
        )}
        <SummaryRow
          label="Shipping"
          value={shippingCost === 0 ? "Free" : `৳${shippingCost.toFixed(2)}`}
        />

        <div className="border-t border-border/60 pt-2.5 flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-foreground">Total</span>
          <span className="text-sm font-bold text-foreground">
            ৳{total.toFixed(2)}
          </span>
        </div>

        {/* Payment method */}
        <div className="border-t border-border/60 pt-2.5 space-y-2">
          <SummaryRow
            label="Payment method"
            value={PAYMENT_LABELS[orderPaymentMethod]}
          />
          {TrxNumber && (
            <SummaryRow label="Transaction number" value={TrxNumber} />
          )}
          {TrxID && <SummaryRow label="Transaction ID" value={TrxID} />}
        </div>
      </div>
    </div>
  );
}
