import { OrderStatus } from "@/generated/prisma/enums";
import { PackageX, RotateCcw } from "lucide-react";

const TRACK_STEPS: {
  status: OrderStatus;
  label: string;
  description: string;
}[] = [
  {
    status: "PENDING",
    label: "Order placed",
    description: "We received your order and are reviewing it.",
  },
  {
    status: "CONFIRMED",
    label: "Confirmed",
    description: "Your order has been confirmed and is being prepared.",
  },
  {
    status: "PROCESSING",
    label: "Processing",
    description: "Items are being packed and made ready for dispatch.",
  },
  {
    status: "SHIPPED",
    label: "Shipped",
    description: "Your order is on its way to you.",
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    description: "Your order has been delivered. Enjoy!",
  },
];

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  if (status === "CANCELLED" || status === "RETURNED") {
    const isCancelled = status === "CANCELLED";
    const Icon = isCancelled ? PackageX : RotateCcw;

    return (
      <div className="flex items-start gap-3">
        <Icon
          className={`mt-0.5 size-5 shrink-0 ${
            isCancelled ? "text-red-600" : "text-orange-600"
          }`}
        />
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isCancelled ? "Order cancelled" : "Order returned"}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isCancelled
              ? "This order was cancelled."
              : "This order has been returned."}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = TRACK_STEPS.findIndex((step) => step.status === status);
  const current = TRACK_STEPS[currentIndex];

  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{current.label}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {current.description}
      </p>

      <ol className="mt-4 grid grid-cols-5 gap-1.5">
        {TRACK_STEPS.map((step, index) => (
          <li
            key={step.status}
            aria-current={index === currentIndex ? "step" : undefined}
          >
            <div
              className={`h-1.5 rounded-full ${
                index <= currentIndex ? "bg-primary" : "bg-muted"
              }`}
            />
            <span
              className={`sr-only text-xs sm:not-sr-only sm:mt-2 sm:block ${
                index === currentIndex
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
