import FaqPageClient from "@/components/main/client-page/faq-page-client";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about MST Bazar's products, orders, delivery, and payments.",
  keywords: [
    "MST Bazar FAQ",
    "Frequently Asked Questions",
    "MST Bazar Support",
    "MST Bazar Help",
    "MST Bazar Customer Service",
    "MST Bazar Delivery",
    "MST Bazar Orders",
    "MST Bazar Products",
  ],
};
export default function FAQPage() {
  return <FaqPageClient />;
}
