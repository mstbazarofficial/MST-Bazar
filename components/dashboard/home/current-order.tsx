import { Panel } from "@/components/dashboard/layout/dashboard-panel";
import { OrderListCard } from "@/components/dashboard/orders/order-list-card";
import { OrderListItem } from "@/components/dashboard/orders/order-meta";
import { OrderStatusTracker } from "@/components/dashboard/orders/order-status-tracker";

export default function CurrentOrder({ order }: { order: OrderListItem }) {
  return (
    <Panel title="Current order">
      <div className="px-5 pb-5">
        <OrderStatusTracker status={order.status} />
      </div>
      <div className="border-t border-border">
        <OrderListCard order={order} />
      </div>
    </Panel>
  );
}
