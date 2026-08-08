import { CheckoutForm } from "@/components/main/checkout/checkout-form";
import HeadingStyle2 from "@/components/main/common/HeadingStyle2";

export default function CheckoutPage() {
  return (
    <main className="site-container section-y">
      <div className="mb-6 sm:mb-8">
        <HeadingStyle2
          secondTitle="Checkout"
          className="mb-5"
          isUnderLine={false}
        />
        <p className="text-sm text-muted-foreground font-medium mt-1">
          Review your items, delivery details, and complete your order.
        </p>
      </div>

      <CheckoutForm />
    </main>
  );
}
