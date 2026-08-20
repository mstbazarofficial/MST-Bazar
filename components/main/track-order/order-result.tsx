import { TrackedOrder } from "@/actions/main/track-order";
import { OrderItems } from "./order-items";
import { OrderOverview } from "./order-overview";
import { OrderStatusStepper } from "./order-status-stepper";
import { OrderSummary } from "./order-summary";

interface OrderResultProps {
  order: TrackedOrder;
}

export function OrderResult({ order }: OrderResultProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Status stepper */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
        <div className="mb-6">
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-primary mb-1">
            Live Status
          </p>
          <h3 className="text-base font-bold text-foreground">
            Tracking order{" "}
            <span className="font-mono tracking-tight">{order.orderId}</span>
          </h3>
        </div>
        <OrderStatusStepper status={order.status} />
      </div>

      {/* Two-column grid on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <OrderOverview order={order} />
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <OrderItems items={order.orderItems} />
        </div>
      </div>

      {/* Summary full width */}
      <OrderSummary order={order} />
    </div>
  );
}
