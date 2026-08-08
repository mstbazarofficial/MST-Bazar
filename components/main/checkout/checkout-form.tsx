"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useCart } from "@/context/cart-provider";
import {
  checkoutDefaultValues,
  checkoutFormSchema,
  DELIVERY_CHARGES,
  type CheckoutFormValues,
} from "@/validation/checkout.validation";

import { placeOrder } from "@/actions/main/order-actions";
import { CheckoutSubmitBar, CheckoutTrustBadges } from "./checkout-submit-bar";
import { ContactInfoFields } from "./contact-info-fields";
import { DeliveryAddressField } from "./delivery-address-field";
import { DeliveryOptionsField } from "./delivery-options-field";
import { ManualPaymentFields } from "./manual-payment-fields";
import { OrderSuccessDialog, type PlacedOrder } from "./order-success-dialog";
import { OrderSummary } from "./order-summary";
import { PaymentMethodField } from "./payment-method-field";

export function CheckoutForm() {
  const { items, errors: cartErrors, clearError, removeItem } = useCart();

  // Items are selected by default; we track *deselected* ids so newly
  // added cart items are automatically included in the order.
  const [deselectedIds, setDeselectedIds] = useState<Set<string>>(new Set());
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Surface background cart-sync failures (quantity/remove) as toasts.
  useEffect(() => {
    const entries = Object.entries(cartErrors);
    if (entries.length === 0) return;
    entries.forEach(([productId, message]) => {
      toast.add({
        title: message,
        type: "error",
      });
      clearError(productId);
    });
  }, [cartErrors, clearError]);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: checkoutDefaultValues,
    mode: "onBlur",
  });

  const deliveryOption = form.watch("deliveryOption");

  const isSelected = (productId: string) => !deselectedIds.has(productId);
  const isAllSelected = deselectedIds.size === 0;
  const selectedCount = items.length - deselectedIds.size;

  const toggleSelect = (productId: string) => {
    setDeselectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setDeselectedIds((prev) =>
      prev.size === 0 ? new Set(items.map((i) => i.productId)) : new Set(),
    );
  };

  const selectedItems = useMemo(
    () => items.filter((item) => !deselectedIds.has(item.productId)),
    [items, deselectedIds],
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce((sum, item) => {
        const discount =
          item.product.price * ((item.product.discountPercentage ?? 0) / 100);
        return sum + (item.product.price - discount) * item.quantity;
      }, 0),
    [selectedItems],
  );

  const deliveryCharge =
    selectedItems.length > 0 ? DELIVERY_CHARGES[deliveryOption] : 0;
  const total = subtotal + deliveryCharge;

  const onSubmit = form.handleSubmit(async (values) => {
    if (selectedItems.length === 0) {
      toast.add({
        title: "Please select at least one item to place an order.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await placeOrder({
        customer: values,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      if (!result.success) {
        toast.add({
          title: result.error,
          type: "error",
        });

        // Surface server-side (re-)validation errors on the right fields.
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            const [, key] = field.split("."); // fieldErrors are namespaced as "customer.<field>"
            const message = messages?.[0];
            if (key && message) {
              form.setError(key as keyof CheckoutFormValues, { message });
            }
          });
        }
        return;
      }

      // Order is saved — drop the ordered items from the cart. Works for
      // both guest (local) and signed-in (server-synced) carts.
      selectedItems.forEach((item) => removeItem(item.productId));

      setPlacedOrder({ orderId: result.orderId, email: values.email, total });
      form.reset(checkoutDefaultValues);
    } catch (error) {
      console.error("Failed to submit order:", error);
      toast.add({
        title:
          "Something went wrong while placing your order. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  // Keep dialog mounted while placedOrder is active
  if (items.length === 0 && !placedOrder) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center shadow-xs">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Your cart is empty
        </h2>
        <p className="mt-1.5 max-w-sm text-xs font-medium text-muted-foreground sm:text-sm">
          Looks like you haven&apos;t added any items to your cart yet. Explore
          our products to start shopping.
        </p>
        <Button
          render={<Link href="/shop" />}
          nativeButton={false}
          className="mt-6"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-3">
          {/* Mobile Order Summary (order-1 on mobile, order-2 on lg sidebar) */}
          <div className="order-1 lg:order-2 lg:col-span-1 lg:sticky lg:top-28">
            <OrderSummary
              items={items}
              isSelected={isSelected}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              isAllSelected={isAllSelected}
              selectedCount={selectedCount}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              total={total}
            />
          </div>

          {/* Form Fields (order-2 on mobile, order-1 on lg) */}
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
            <ContactInfoFields />
            <DeliveryAddressField />
            <DeliveryOptionsField />
            <PaymentMethodField />
            <ManualPaymentFields />
          </div>
        </div>

        <CheckoutTrustBadges />
        <CheckoutSubmitBar isSubmitting={isSubmitting} />
      </form>

      <OrderSuccessDialog
        order={placedOrder}
        onOpenChange={(open) => {
          if (!open) setPlacedOrder(null);
        }}
      />
    </FormProvider>
  );
}
