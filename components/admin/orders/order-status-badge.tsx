import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/utils/order-status";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent", ORDER_STATUS_STYLES[status])}
    >
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
