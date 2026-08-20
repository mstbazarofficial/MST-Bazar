import { CheckoutForm } from "@/components/main/checkout/checkout-form";
import { SectionHeading } from "@/components/main/common/layout/section-heading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
};
export default function CheckoutPage() {
  return (
    <main className="site-container section-y">
      <div className="mb-6 sm:mb-8">
        <SectionHeading title="Checkout" />
        <p className="text-sm text-muted-foreground font-medium mt-1">
          Review your items, delivery details, and complete your order.
        </p>
      </div>

      <CheckoutForm />
    </main>
  );
}
