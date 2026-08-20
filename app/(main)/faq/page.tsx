import FaqPageClient from "@/components/main/client-page/faq-page-client";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Frequently Asked Questions",
};
export default function FAQPage() {
  return <FaqPageClient />;
}
