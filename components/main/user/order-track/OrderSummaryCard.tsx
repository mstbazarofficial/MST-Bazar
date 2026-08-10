"use client";

import { OrderData } from "@/app/(main)/user/order-track/[slug]/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function OrderSummaryCard({
  order,
  className,
}: {
  order: OrderData;
  className?: string;
}) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className={cn("mb-6  border border-primary/50 rounded-md", className)}
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-primary/50">
          {/* Order ID & Date */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-lg">
                  {order.orderId}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy Order ID"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Placed on</p>
              <p className="font-semibold text-gray-900">
                {order.placedOnDate}, {order.placedOnTime}
              </p>
            </div>
          </div>

          {/* Order Total */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Total</p>
            <p className="font-bold text-green-700 text-xl mb-2">
              ৳{order.total.toLocaleString()}
            </p>
            <Badge
              variant="outline"
              className={`px-3 py-0.5 rounded-md shadow-none ${
                order.paymentStatus === "Paid"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-orange-50 text-orange-700 border-orange-200"
              }`}
            >
              {order.paymentStatus}
            </Badge>
          </div>

          {/* Payment Method */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Payment Method</p>
            <div className="flex items-center gap-2">
              <div className="text-pink-600">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L3 8v8l9 6 9-6V8l-9-6zm0 2.5l6 4v5l-6 4-6-4v-5l6-4z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">
                {order.paymentMethod}
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Status</p>
            <Badge
              className={cn(
                "  px-4 py-1 rounded-full shadow-none text-sm font-medium",
                {
                  "bg-gray-50 text-gray-700 border-gray-200":
                    order.currentStatus === "pending",
                  "bg-red-50 text-red-700 border-red-200":
                    order.currentStatus === "cancelled",
                  "bg-blue-50 text-blue-700 border-blue-200":
                    order.currentStatus === "in-progress",
                  "bg-green-50 text-green-700 border-green-200":
                    order.currentStatus === "delivered",
                },
              )}
            >
              {order.currentStatus}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
