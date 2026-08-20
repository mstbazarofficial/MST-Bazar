import { OrderStatus } from "@/generated/prisma/enums";
import {
  CheckCircle2,
  Circle,
  Package,
  PackageCheck,
  PackageOpen,
  PackageX,
  RotateCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";

const TRACK_STEPS: {
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    status: "PENDING",
    label: "Order Placed",
    description: "We received your order and are reviewing it.",
    icon: ShoppingBag,
  },
  {
    status: "CONFIRMED",
    label: "Confirmed",
    description: "Your order has been confirmed and is being prepared.",
    icon: PackageCheck,
  },
  {
    status: "PROCESSING",
    label: "Processing",
    description: "Items are being packed and made ready for dispatch.",
    icon: Package,
  },
  {
    status: "SHIPPED",
    label: "Shipped",
    description: "Your order is on its way to you.",
    icon: Truck,
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    description: "Your order has been delivered. Enjoy!",
    icon: PackageOpen,
  },
];

const CANCELLED_STEP = {
  status: "CANCELLED" as OrderStatus,
  label: "Cancelled",
  description: "This order was cancelled.",
  icon: PackageX,
};

const RETURNED_STEP = {
  status: "RETURNED" as OrderStatus,
  label: "Returned",
  description: "This order has been returned.",
  icon: RotateCcw,
};

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

function getStepState(
  stepStatus: OrderStatus,
  currentStatus: OrderStatus,
): "done" | "active" | "upcoming" {
  if (currentStatus === "CANCELLED" || currentStatus === "RETURNED") {
    return stepStatus === "PENDING" ? "done" : "upcoming";
  }
  const stepIdx = STATUS_ORDER.indexOf(stepStatus);
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  if (stepIdx < currentIdx) return "done";
  if (stepIdx === currentIdx) return "active";
  return "upcoming";
}

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const isTerminal = status === "CANCELLED" || status === "RETURNED";
  const terminalStep = status === "CANCELLED" ? CANCELLED_STEP : RETURNED_STEP;

  const steps = isTerminal ? [...TRACK_STEPS, terminalStep] : TRACK_STEPS;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <h2 className="text-sm font-bold text-foreground">Order Tracking</h2>
      </div>

      <div className="px-5 py-5">
        <ol className="relative space-y-0">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const stepState =
              isTerminal && step.status === status
                ? "active"
                : getStepState(step.status as OrderStatus, status);

            const Icon = step.icon;

            return (
              <li key={step.status} className="flex gap-4">
                {/* Icon + connector line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors z-10 ${
                      stepState === "done"
                        ? "bg-primary border-primary text-primary-foreground"
                        : stepState === "active"
                          ? status === "CANCELLED"
                            ? "bg-red-500 border-red-500 text-white"
                            : status === "RETURNED"
                              ? "bg-orange-500 border-orange-500 text-white"
                              : "bg-primary border-primary text-primary-foreground"
                          : "bg-card border-border text-muted-foreground/40"
                    }`}
                  >
                    {stepState === "done" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : stepState === "active" ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 my-1 rounded-full min-h-8 ${
                        stepState === "done" ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="pb-6 pt-0.5 min-w-0">
                  <p
                    className={`text-sm font-semibold leading-tight ${
                      stepState === "upcoming"
                        ? "text-muted-foreground/50"
                        : "text-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {stepState !== "upcoming" && (
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
