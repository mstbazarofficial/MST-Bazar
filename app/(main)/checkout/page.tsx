import { CheckoutForm } from "@/components/main/checkout/checkout-form";

export default function CheckoutPage() {
  return (
    <main className="site-container section-y">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Checkout
        </h1>
        <p className="text-sm text-muted-foreground font-medium mt-1">
          Review your items, delivery details, and complete your order.
        </p>
      </div>

      <CheckoutForm />
    </main>
  );
}
