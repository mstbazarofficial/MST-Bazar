"use client";

import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { calculatePromoDiscount } from "@/utils/calculate-promo-discount";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useCart } from "@/context/cart-provider";
import { authClient } from "@/lib/auth-client"; // Better Auth client import
import {
  checkoutDefaultValues,
  checkoutFormSchema,
  DELIVERY_CHARGES,
  type CheckoutFormValues,
} from "@/validation/checkout.validation";

import { placeOrder } from "@/actions/main/order-actions";
import type { AppliedPromo } from "@/actions/main/promo-actions";
import { CheckoutSubmitBar, CheckoutSubmitPanel } from "./checkout-submit-bar";
import { ContactInfoFields } from "./contact-info-fields";
import { DeliveryAddressField } from "./delivery-address-field";
import { DeliveryOptionsField } from "./delivery-options-field";
import { ManualPaymentFields } from "./manual-payment-fields";
import { savePlacedOrder } from "./order-success";
import { OrderSummary } from "./order-summary";
import { PaymentMethodField } from "./payment-method-field";

// Top to bottom on the page, so the first error found is the first one seen.
const FIELD_ORDER: (keyof CheckoutFormValues)[] = [
  "fullName",
  "phone",
  "email",
  "whatsapp",
  "address",
  "paymentPhone",
  "transactionId",
];

/** Takes the names of the invalid fields and brings the first one into view. */
function scrollToFirstError(invalidFields: string[]) {
  const name = FIELD_ORDER.find((field) => invalidFields.includes(field));
  if (!name) return;

  const element = document.getElementById(name);
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
  element?.focus({ preventScroll: true });
}

export function CheckoutForm() {
  const {
    items,
    isLoading,
    errors: cartErrors,
    clearError,
    clearCart,
  } = useCart();
  const router = useRouter();

  // Fetch Better Auth session on client side
  const { data: session } = authClient.useSession();

  const [isPlaced, setIsPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

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
    shouldFocusError: false,
  });

  // Auto-fill user information from Better Auth session
  useEffect(() => {
    if (session?.user) {
      const user = session.user;
      const currentValues = form.getValues();

      form.reset({
        ...currentValues,
        fullName: currentValues.fullName || user.name || "",
        email: currentValues.email || user.email || "",
        phone: currentValues.phone || user.phoneNumber || "",
        whatsapp: currentValues.whatsapp || user.whatsappNumber || "",
        address: currentValues.address || user.fullAddress || "",
      });
    }
  }, [session, form]);

  const deliveryOption = form.watch("deliveryOption");
  const deliveryCharge = DELIVERY_CHARGES[deliveryOption];

  const orderItems = items.map((item) => ({
    price: item.product.price,
    discountPercentage: item.product.discountPercentage,
    quantity: item.quantity,
  }));

  const { itemsSubtotal: subtotal } = calculateOrderTotal({
    orderItems,
    discount: 0,
    shippingCost: deliveryCharge,
  });

  const promoDiscount = appliedPromo
    ? calculatePromoDiscount(appliedPromo, subtotal)
    : 0;

  const { finalTotal: total } = calculateOrderTotal({
    orderItems,
    discount: promoDiscount,
    shippingCost: deliveryCharge,
  });

  const onSubmit = form.handleSubmit(
    async (values) => {
      setIsSubmitting(true);

      try {
        const result = await placeOrder({
          customer: values,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          promoCode: appliedPromo?.code,
        });

        if (!result.success) {
          toast.add({
            title: result.error,
            type: "error",
          });

          if (result.fieldErrors) {
            const invalidFields: string[] = [];
            Object.entries(result.fieldErrors).forEach(([field, messages]) => {
              const [, key] = field.split(".");
              const message = messages?.[0];
              if (key && message) {
                form.setError(key as keyof CheckoutFormValues, { message });
                invalidFields.push(key);
              }
            });
            scrollToFirstError(invalidFields);
          }
          return;
        }

        savePlacedOrder({
          orderId: result.orderId,
          email: values.email,
          total: result.total,
          phone: values.phone,
          metaEventId: result.metaEventId,
          items: items.map((item) => ({
            id: item.productId,
            quantity: item.quantity,
          })),
        });
        setIsPlaced(true);
        clearCart();
        router.replace("/checkout/success");
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
    },
    (errors) => {
      toast.add({
        title: "Please fix the highlighted details.",
        type: "error",
      });
      scrollToFirstError(Object.keys(errors));
    },
  );

  // Also covers the moment between clearing the cart and reaching the success page.
  if (isPlaced || (isLoading && items.length === 0)) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-16 rounded-xl lg:order-2 lg:col-span-5 lg:h-96" />
        <div className="space-y-6 lg:col-span-7">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
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
          render={<Link href="/products" />}
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
      <form onSubmit={onSubmit} noValidate>
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="space-y-4 lg:sticky lg:top-6 lg:order-2 lg:col-span-5">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              total={total}
              appliedPromo={appliedPromo}
              promoDiscount={promoDiscount}
              onApplyPromo={setAppliedPromo}
              onRemovePromo={() => setAppliedPromo(null)}
            />
            <CheckoutSubmitPanel isSubmitting={isSubmitting} />
          </div>

          <div className="space-y-4 lg:order-1 lg:col-span-7 lg:space-y-6">
            <ContactInfoFields />
            <DeliveryAddressField />
            <DeliveryOptionsField />
            <PaymentMethodField />
            <ManualPaymentFields total={total} />
          </div>
        </div>

        <CheckoutSubmitBar isSubmitting={isSubmitting} total={total} />
      </form>
    </FormProvider>
  );
}
