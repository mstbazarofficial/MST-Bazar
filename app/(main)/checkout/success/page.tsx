import { OrderSuccess } from "@/components/main/checkout/order-success";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Placed",
  description: "Your MST Bazar order has been placed.",
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <main className="site-container py-8 sm:py-12">
      <OrderSuccess />
    </main>
  );
}
