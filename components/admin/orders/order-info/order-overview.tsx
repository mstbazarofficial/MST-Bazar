import type { OrderWithDetails } from "@/actions/admin/order-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { formatDate, formatDateTime } from "@/utils/format-date";
import { formatPaymentMethod } from "@/utils/format-payment-method";
import { formatPrice } from "@/utils/format-price";
import {
  ORDER_FULFILMENT_STEPS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from "@/utils/order-status";
import {
  Activity,
  Check,
  CircleDollarSign,
  Clock,
  NotebookText,
  Package,
  ShoppingBag,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { OrderSummaryCard } from "./order-summary-card";

export function StatTile({
  icon: Icon,
  iconClass,
  label,
  value,
  children,
}: {
  icon: LucideIcon;
  iconClass: string;
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full",
            iconClass,
          )}
        >
          <Icon className="size-3.5" />
        </span>
      </div>
      <p className="mt-1 text-xl font-semibold text-foreground tabular-nums">
        {value}
      </p>
      <div className="mt-1 text-xs text-muted-foreground">{children}</div>
    </div>
  );
}

function StatusTile({ status }: { status: OrderStatus }) {
  const stepIndex = ORDER_FULFILMENT_STEPS.indexOf(status);
  const nextStep = ORDER_FULFILMENT_STEPS[stepIndex + 1];

  return (
    <StatTile
      icon={Truck}
      iconClass={ORDER_STATUS_STYLES[status]}
      label="Status"
      value={ORDER_STATUS_LABELS[status]}
    >
      {stepIndex === -1 ? (
        "Order closed"
      ) : (
        <>
          <div className="mb-1.5 flex gap-1">
            {ORDER_FULFILMENT_STEPS.map((step, index) => (
              <span
                key={step}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  index <= stepIndex ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>
          {nextStep ? (
            <>
              Next:{" "}
              <span className="font-medium text-foreground">
                {ORDER_STATUS_LABELS[nextStep]}
              </span>
            </>
          ) : (
            "All steps complete"
          )}
        </>
      )}
    </StatTile>
  );
}

function getDueTile(order: OrderWithDetails, due: number) {
  if (order.status === "CANCELLED" || order.status === "RETURNED") {
    return { value: "—", hint: "Order closed", settled: true };
  }
  if (due < 0) {
    return {
      value: formatPrice(0),
      hint: `Overpaid by ${formatPrice(-due)}`,
      settled: true,
    };
  }
  if (due === 0) {
    return { value: formatPrice(0), hint: "Fully paid", settled: true };
  }
  return {
    value: formatPrice(due),
    hint:
      order.orderPaymentMethod === "CASH_ON_DELIVERY"
        ? "Collect on delivery"
        : "Awaiting payment",
    settled: false,
  };
}

function Journey({ order }: { order: OrderWithDetails }) {
  const isOpen = ORDER_FULFILMENT_STEPS.includes(order.status);
  const steps = isOpen ? ORDER_FULFILMENT_STEPS : [order.status];
  const currentIndex = steps.indexOf(order.status);

  return (
    <Card>
      <CardHeader>
        <div className="flex min-h-8 items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Journey</CardTitle>
          <span className="text-xs text-muted-foreground">
            Placed {formatDate(order.orderDate)}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <ol>
          {steps.map((step, index) => {
            const isCurrent = index === currentIndex;
            const isDone = index < currentIndex;

            return (
              <li
                key={step}
                aria-current={isCurrent ? "step" : undefined}
                className="group/step relative flex gap-3 pb-5 last:pb-0"
              >
                <span
                  className={cn(
                    "absolute top-6 bottom-0 left-2.75 border-l-2 group-last/step:hidden",
                    isDone ? "border-primary" : "border-dashed border-border",
                  )}
                />
                <span
                  className={cn(
                    "relative flex size-6 shrink-0 items-center justify-center rounded-full",
                    isDone && "bg-primary text-primary-foreground",
                    isCurrent && "ring-2 ring-offset-2 ring-offset-card",
                    isCurrent && ORDER_STATUS_STYLES[step],
                    !isDone &&
                      !isCurrent &&
                      "border-2 border-dashed border-border",
                  )}
                >
                  {isDone && <Check className="size-3.5" />}
                  {isCurrent && (
                    <span className="size-2.5 rounded-full bg-current" />
                  )}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm leading-6",
                      isCurrent
                        ? "font-semibold text-foreground"
                        : isDone
                          ? "text-foreground"
                          : "text-muted-foreground",
                    )}
                  >
                    {ORDER_STATUS_LABELS[step]}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-muted-foreground">
                      Current status
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

type ActivityEntry = {
  id: string;
  icon: LucideIcon;
  iconClass: string;
  title: string;
  detail?: string;
  date: Date;
};

function getRecentActivity(order: OrderWithDetails) {
  const entries: ActivityEntry[] = [
    {
      id: "placed",
      icon: ShoppingBag,
      iconClass: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
      title: "Order placed",
      date: order.orderDate,
    },
    ...order.payments.map((payment) => ({
      id: payment.id,
      icon: CircleDollarSign,
      iconClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
      title: `Payment of ${formatPrice(payment.amount)} received`,
      detail: formatPaymentMethod(payment.method),
      date: payment.date,
    })),
    ...order.notes.map((note) => ({
      id: note.id,
      icon: NotebookText,
      iconClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
      title: "Note added",
      detail: note.content,
      date: note.createdAt,
    })),
  ];

  return entries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
}

function RecentActivity({ order }: { order: OrderWithDetails }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex min-h-8 items-center gap-2 text-base font-semibold">
          <Activity className="size-4" />
          Recent activity
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {getRecentActivity(order).map(
          ({ id, icon: Icon, iconClass, title, detail, date }) => (
            <div key={id} className="flex gap-3 rounded-xl bg-muted/50 p-3">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full",
                  iconClass,
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                {detail && (
                  <p className="line-clamp-2 text-xs wrap-break-word text-muted-foreground">
                    {detail}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDateTime(date)}
                </p>
              </div>
            </div>
          ),
        )}
      </CardContent>
    </Card>
  );
}

export function OrderOverview({
  order,
  finalTotal,
  paidAmount,
  onEditSummary,
}: {
  order: OrderWithDetails;
  finalTotal: number;
  paidAmount: number;
  onEditSummary: () => void;
}) {
  const unitCount = order.orderItems.reduce((sum, i) => sum + i.quantity, 0);
  const dueTile = getDueTile(order, finalTotal - paidAmount);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatusTile status={order.status} />
        <StatTile
          icon={Wallet}
          iconClass="bg-blue-500/15 text-blue-700 dark:text-blue-400"
          label="Order total"
          value={formatPrice(finalTotal)}
        >
          After shipping and discount
        </StatTile>
        <StatTile
          icon={dueTile.settled ? Check : Clock}
          iconClass={
            dueTile.settled
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
          }
          label="Due"
          value={dueTile.value}
        >
          {dueTile.hint}
        </StatTile>
        <StatTile
          icon={Package}
          iconClass="bg-violet-500/15 text-violet-700 dark:text-violet-400"
          label="Units"
          value={String(unitCount)}
        >
          {order.orderItems.length}{" "}
          {order.orderItems.length === 1 ? "product" : "products"}
        </StatTile>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <OrderSummaryCard order={order} onEditClick={onEditSummary} />
          <RecentActivity order={order} />
        </div>
        <Journey order={order} />
      </div>
    </div>
  );
}
