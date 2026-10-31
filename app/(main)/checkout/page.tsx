import { CheckoutForm } from "@/components/main/checkout/checkout-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review your items, delivery details, and complete your order on our checkout page.",
};
export default function CheckoutPage() {
  return (
    <main className="site-container py-4 pb-28 sm:py-6 sm:pb-28 lg:pb-10">
      <h1 className="sr-only">Checkout</h1>
      <CheckoutForm />
    </main>
  );
}
