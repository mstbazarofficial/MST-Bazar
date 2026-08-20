import { OrderStatus } from "@/generated/prisma/enums";
import {
  Check,
  ClipboardCheck,
  Clock,
  Package,
  PackageOpen,
  PackageX,
  RotateCcw,
  Truck,
} from "lucide-react";

interface StepItem {
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.ElementType;
}

const STANDARD_STEPS: StepItem[] = [
  {
    status: "PENDING",
    label: "Order Placed",
    description: "Received & under review",
    icon: Clock,
  },
  {
    status: "CONFIRMED",
    label: "Confirmed",
    description: "Confirmed & preparing",
    icon: ClipboardCheck,
  },
  {
    status: "PROCESSING",
    label: "Processing",
    description: "Packing items for dispatch",
    icon: Package,
  },
  {
    status: "SHIPPED",
    label: "Shipped",
    description: "On the way to destination",
    icon: Truck,
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    description: "Package safely delivered",
    icon: PackageOpen,
  },
];

const CANCELLED_STEP: StepItem = {
  status: "CANCELLED",
  label: "Cancelled",
  description: "Order was cancelled",
  icon: PackageX,
};

const RETURNED_STEP: StepItem = {
  status: "RETURNED",
  label: "Returned",
  description: "Item has been returned",
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
    if (stepStatus === currentStatus) return "active";
    return stepStatus === "PENDING" ? "done" : "upcoming";
  }

  const stepIdx = STATUS_ORDER.indexOf(stepStatus);
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  if (stepIdx < currentIdx) return "done";
  if (stepIdx === currentIdx) return "active";
  return "upcoming";
}

interface OrderStatusStepperProps {
  status: OrderStatus;
}

export function OrderStatusStepper({ status }: OrderStatusStepperProps) {
  const isCancelled = status === "CANCELLED";
  const isReturned = status === "RETURNED";
  const isTerminal = isCancelled || isReturned;

  const terminalStep = isCancelled ? CANCELLED_STEP : RETURNED_STEP;
  const stepsToShow = isTerminal
    ? [...STANDARD_STEPS, terminalStep]
    : STANDARD_STEPS;

  return (
    <div className="w-full py-2">
      <div className="flex flex-col sm:flex-row items-start sm:justify-between w-full px-1">
        {stepsToShow.map((step, idx) => {
          const stepState = getStepState(step.status, status);
          const isTerminalStep = isTerminal && step.status === status;
          const isLast = idx === stepsToShow.length - 1;
          const Icon = step.icon;

          // Horizontal connector line color (Desktop)
          let lineBgClass = "bg-border";
          if (idx > 0) {
            if (isTerminalStep) {
              lineBgClass = isCancelled ? "bg-destructive" : "bg-amber-500";
            } else if (stepState === "done" || stepState === "active") {
              lineBgClass = "bg-primary";
            }
          }

          // Vertical connector line color (Mobile)
          const verticalLineBgClass =
            stepState === "done" ? "bg-primary" : "bg-border";

          return (
            <div
              key={step.status}
              className={`flex-1 flex flex-row sm:flex-col items-start sm:items-center relative w-full sm:w-auto pb-6 last:pb-0 sm:pb-0 transition-opacity duration-200 ${
                stepState === "upcoming" ? "opacity-40" : "opacity-100"
              }`}
            >
              {/* Desktop Horizontal Line */}
              {idx > 0 && (
                <div
                  className={`hidden sm:block absolute top-5.5 w-full h-0.75 transition-colors z-0 ${lineBgClass}`}
                  style={{ left: "-50%", right: "50%" }}
                />
              )}

              {/* Mobile Vertical Line */}
              {!isLast && (
                <div
                  className={`sm:hidden absolute top-11 left-5.25 w-[2.5px] h-[calc(100%-20px)] -translate-x-1/2 transition-colors ${verticalLineBgClass}`}
                />
              )}

              {/* Circle Badge Icon */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center border-[2.5px] transition-all relative z-10 shrink-0 ${
                  isCancelled && isTerminalStep
                    ? "bg-destructive border-destructive text-destructive-foreground ring-4 ring-destructive/20 scale-105"
                    : isReturned && isTerminalStep
                      ? "bg-amber-500 border-amber-500 text-white ring-4 ring-amber-500/20 scale-105"
                      : stepState === "active"
                        ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20 scale-105 shadow-sm"
                        : stepState === "done"
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-card border-border text-muted-foreground"
                }`}
              >
                {stepState === "done" ? (
                  <Check className="w-4 h-4 stroke-3" />
                ) : (
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                )}
              </div>

              {/* Label & Active Description */}
              <div className="ml-3.5 sm:ml-0 flex flex-col items-start sm:items-center min-w-0 pt-1.5 sm:pt-0">
                <span
                  className={`text-xs sm:text-[0.78rem] sm:mt-2.5 leading-tight transition-colors ${
                    isCancelled && isTerminalStep
                      ? "text-destructive font-bold"
                      : isReturned && isTerminalStep
                        ? "text-amber-500 font-bold"
                        : stepState === "active"
                          ? "text-primary font-bold"
                          : stepState === "done"
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground font-medium"
                  }`}
                >
                  {step.label}
                </span>

                {/* Subtext ONLY visible for active step */}
                {stepState === "active" && (
                  <p className="text-xs text-muted-foreground mt-1 text-left sm:text-center leading-tight">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
