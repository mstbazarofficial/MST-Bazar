import { Panel } from "@/components/dashboard/layout/dashboard-panel";
import { PaymentMethod } from "@/generated/prisma/enums";
import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { formatExactPrice } from "@/utils/format-price";
import { PAYMENT_LABELS } from "./order-meta";

interface OrderSummaryCardProps {
  orderPaymentMethod: PaymentMethod;
  TrxNumber?: string | null;
  TrxID?: string | null;
  shippingCost: number;
  discount: number;
  promoCode?: string | null;
  orderItems: {
    price: number;
    quantity: number;
    discountPercentage: number;
  }[];
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-foreground tabular-nums">
        {value}
      </span>
    </div>
  );
}

export function OrderSummaryCard({
  orderPaymentMethod,
  TrxNumber,
  TrxID,
  shippingCost,
  discount,
  promoCode,
  orderItems,
}: OrderSummaryCardProps) {
  const subtotal = orderItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const { itemsSubtotal, finalTotal: total } = calculateOrderTotal({
    orderItems,
    shippingCost,
    discount,
  });

  const itemDiscount = subtotal - itemsSubtotal;

  return (
    <Panel title="Payment summary">
      <div className="space-y-2.5 px-5 pb-5">
        <SummaryRow label="Subtotal" value={formatExactPrice(subtotal)} />
        {itemDiscount > 0 && (
          <SummaryRow
            label="Item discount"
            value={`-${formatExactPrice(itemDiscount)}`}
          />
        )}
        {discount > 0 && (
          <SummaryRow
            label={promoCode ? `Promo (${promoCode})` : "Order discount"}
            value={`-${formatExactPrice(discount)}`}
          />
        )}
        <SummaryRow
          label="Shipping"
          value={shippingCost === 0 ? "Free" : formatExactPrice(shippingCost)}
        />

        <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5 text-sm font-semibold text-foreground">
          <span>Total</span>
          <span className="tabular-nums">{formatExactPrice(total)}</span>
        </div>

        <div className="space-y-2.5 border-t border-border pt-2.5">
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
    </Panel>
  );
}
