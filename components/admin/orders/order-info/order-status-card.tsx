"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Package,
  RotateCcw,
  Settings,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { updateOrderStatus } from "@/actions/admin/order-mutations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { toast } from "@/components/ui/toast";
import type { OrderStatus } from "@/generated/prisma/enums";
import { getErrorMessage } from "@/utils/get-error-message";

const statusOptions: {
  value: OrderStatus;
  label: string;
  icon: typeof Clock;
}[] = [
  { value: "PENDING", label: "Pending", icon: Clock },
  { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { value: "PROCESSING", label: "Processing", icon: Loader2 },
  { value: "SHIPPED", label: "Shipped", icon: Truck },
  { value: "DELIVERED", label: "Delivered", icon: Package },
  { value: "RETURNED", label: "Returned", icon: RotateCcw },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
];

interface OrderStatusCardProps {
  order: {
    id: string;
    status: OrderStatus;
  };
  onSuccess?: () => void;
}

export function OrderStatusCard({ order, onSuccess }: OrderStatusCardProps) {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [error, setError] = useState<string | null>(null);

  const isDirty = status !== order.status;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      setError(null);
      const res = await updateOrderStatus({
        orderId: order.id,
        input: { status },
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (onSuccess) {
        onSuccess();
      }
      toast.add({
        title: "Order status updated",
        type: "success",
      });
    },
    onError: (err: unknown) => {
      setError(getErrorMessage(err));
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Settings className="size-4" />
          Manage Order Status
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <NativeSelect
            disabled={isPending}
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-full"
          >
            <NativeSelectOption value="" disabled>
              Select status
            </NativeSelectOption>

            {statusOptions.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <Button
          className="w-full gap-2"
          disabled={!isDirty || isPending}
          onClick={() => mutate()}
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isPending ? "Updating Status..." : "Save Status Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
