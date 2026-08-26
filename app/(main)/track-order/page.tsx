import { SectionHeading } from "@/components/main/common/layout/section-heading";
import Testimonials from "@/components/main/common/Testimonials";
import { TrackOrderClient } from "@/components/main/track-order/track-order-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Enter your Order ID and mobile number to get real-time updates on your delivery.",
  keywords: [
    "MST Bazar",
    "Track Order",
    "Order Tracking",
    "Delivery Updates",
    "Order Status",
    "Real-time Tracking",
    "Customer Support",
    "Online Grocery Shopping",
    "Nationwide Delivery",
  ],
};

export default function TrackOrderPage() {
  return (
    <main className="">
      <TrackOrderClient />
      <Testimonials />
    </main>
  );
}
