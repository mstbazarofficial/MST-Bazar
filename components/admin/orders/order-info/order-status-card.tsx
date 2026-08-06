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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import type { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
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

const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: "CASH_ON_DELIVERY", label: "Cash on Delivery" },
  { value: "BKASH", label: "bKash" },
  { value: "ROCKET", label: "Rocket" },
  { value: "NAGAD", label: "Nagad" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CARD", label: "Card Payment" },
  { value: "OTHER", label: "Other" },
];

type OrderStatusInput = {
  status: OrderStatus;
  orderPaymentMethod: PaymentMethod;
  TrxID: string | null;
  TrxNumber: string | null;
};

interface OrderStatusCardProps {
  order: OrderStatusInput & { id: string };
  onSuccess?: () => void;
}

export function OrderStatusCard({ order, onSuccess }: OrderStatusCardProps) {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    order.orderPaymentMethod,
  );
  const [TrxId, setTrxId] = useState<string>(order.TrxID ?? "");
  const [TrxNumber, setTrxNumber] = useState<string>(order.TrxNumber ?? "");
  const [error, setError] = useState<string | null>(null);

  const isDirty =
    status !== order.status ||
    paymentMethod !== order.orderPaymentMethod ||
    TrxId !== (order.TrxID ?? "") ||
    TrxNumber !== (order.TrxNumber ?? "");

  // React Query Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      setError(null);
      const res = await updateOrderStatus({
        orderId: order.id,
        input: {
          status,
          orderPaymentMethod: paymentMethod,
          TrxID: TrxId || null,
          TrxNumber: TrxNumber || null,
        },
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
        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Order Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <Select
            disabled={isPending}
            value={status}
            onValueChange={(v) => setStatus(v as OrderStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Payment Method</Label>
          <Select
            disabled={isPending}
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentMethodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Reference */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Transaction Number</Label>
          <Input
            disabled={isPending}
            value={TrxNumber}
            onChange={(e) => setTrxNumber(e.target.value)}
            placeholder="Transaction Number / reference"
          />
        </div>
        {/* Payment Reference */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Transaction Reference</Label>
          <Input
            disabled={isPending}
            value={TrxId}
            onChange={(e) => setTrxId(e.target.value)}
            placeholder="Transaction ID / reference"
          />
        </div>

        {/* Save Button with Loading State */}
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
