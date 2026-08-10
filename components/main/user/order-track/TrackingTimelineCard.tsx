import { TimelineStep } from "@/app/(main)/user/order-track/[slug]/page";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Edit3,
  Package,
  Truck,
  Check,
  Navigation,
  XCircle,
} from "lucide-react";

interface TrackingTimelineProps {
  steps: TimelineStep[];
  isCancelled?: boolean;
  className?: string;
}

export function TrackingTimelineCard({
  steps,
  isCancelled = false,
  className,
}: TrackingTimelineProps) {
  const completedCount = steps.filter((step) => step.completed).length;
  const progressPercentage =
    steps.length > 1 ? ((completedCount - 1) / (steps.length - 1)) * 100 : 0;

  const isDelivered =
    !isCancelled &&
    steps[steps.length - 1].completed &&
    steps[steps.length - 1].title === "Delivered";

  const isAnyStepPending = steps.some((step) => !step.completed);

  const deliveredStep = steps.find((step) => step.title === "Delivered");

  const getIcon = [Edit3, Package, Truck, Navigation, Check];

  return (
    <Card
      className={cn(
        "mb-6 shadow-sm border border-primary/55 rounded-xl",
        isCancelled && "border-red-500",
        className,
      )}
    >
      <CardContent className="p-6 md:p-8">
        {/* Stepper */}
        <div className="relative flex justify-between items-start mb-12">
          {/* Background Connecting Line (Gray) */}
          <div className="absolute top-6 left-[10%] w-[80%] h-1 bg-gray-200 z-0 hidden md:block"></div>

          {/* Active Connecting Line (Green or Red if Cancelled) */}
          <div
            className={`absolute top-6 left-[10%] h-1 z-0 hidden md:block transition-all duration-500 ease-in-out ${
              isCancelled ? "bg-red-500" : "bg-green-700"
            }`}
            style={{ width: `${progressPercentage * 0.8}%` }}
          ></div>

          {steps.map((step, idx) => {
            const isLastCompletedStep =
              step.completed &&
              (idx === steps.length - 1 || !steps[idx + 1]?.completed);

            const Icon =
              isCancelled && isLastCompletedStep
                ? XCircle
                : getIcon[idx] || Check;

            let circleClasses =
              "border-primary-dark text-primary-dark bg-green-50";
            if (step.completed) {
              if (isCancelled && isLastCompletedStep) {
                circleClasses = "bg-red-500 border-red-500 text-white";
              } else {
                circleClasses =
                  "bg-primary-dark border-primary-dark text-primary-foreground";
              }
            }

            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center flex-1 text-center"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-3 transition-colors duration-300 ${circleClasses}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4
                  className={`text-sm font-semibold mb-1 ${
                    step.completed
                      ? isCancelled && isLastCompletedStep
                        ? "text-red-600"
                        : "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {isCancelled && isLastCompletedStep
                    ? "Cancelled"
                    : step.title}
                </h4>
                {step.date && step.completed && (
                  <p className="text-xs text-gray-500">{step.date}</p>
                )}
                {step.time && step.completed && (
                  <p className="text-xs text-gray-500">{step.time}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Success Alert Banner (Only visible if Delivered and NOT cancelled) */}
        {isDelivered && deliveredStep && !isAnyStepPending && (
          <div className="bg-green-50/80 border border-green-100 rounded-lg p-5 flex items-start gap-4 transition-all animate-in fade-in slide-in-from-bottom-2 mt-4">
            <div className="bg-green-700 rounded-full p-3 mt-0.5">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-green-800 font-bold text-lg mb-1">
                Your order has been delivered!
              </h4>
              <p className="text-gray-600 text-sm">
                Your order was delivered on {deliveredStep.date} at{" "}
                {deliveredStep.time}. Thank you for shopping with MST Bazar.
              </p>
            </div>
          </div>
        )}

        {/* Cancelled Alert Banner (Only visible if Cancelled) */}
        {isCancelled && (
          <div className="bg-red-50/80 border border-red-100 rounded-lg p-5 flex items-start gap-4 transition-all animate-in fade-in slide-in-from-bottom-2 mt-4">
            <div className="bg-red-500 rounded-full p-3 mt-0.5">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-red-800 font-bold text-lg mb-1">
                Order Cancelled
              </h4>
              <p className="text-red-700 text-sm">
                This order has been cancelled and will not be delivered. If you
                have already paid, a refund will be initiated soon.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
