import { SectionHeading } from "@/components/main/common/layout/section-heading";
import {
  Clock,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Return & Refund Policy",
  description:
    "Read our Return & Refund Policy to understand how we handle returns, refunds, and exchanges at MST Bazar.",
  keywords: [
    "MST Bazar",
    "Return & Refund Policy",
    "Returns",
    "Refunds",
    "Exchanges",
    "Customer Support",
    "Online Grocery Shopping",
    "Nationwide Delivery",
  ],
};

// Mock data that can later be replaced with an API call from the backend
const refundPolicyData = {
  header: {
    title: "Return & Refund Policy",
    subtitle:
      "We want you to be completely satisfied with your purchase. Read our policy below to understand how we handle returns and refunds.",
    lastUpdated: "August 12, 2026",
  },
  sections: [
    {
      id: "return-policy",
      title: "1. Return Policy",
      icon: RefreshCcw,
      content: [
        "We accept returns within 7 days of delivery for most items.",
        "To be eligible for a return, your item must be unused, in its original packaging, and in the same condition that you received it.",
        "Perishable goods, such as fresh vegetables, fruits, and meat, are not eligible for return unless they are delivered damaged, spoiled, or incorrect.",
        "A receipt or proof of purchase is required to complete your return.",
      ],
    },
    {
      id: "refund-process",
      title: "2. Refund Process",
      icon: CreditCard,
      content: [
        "Once your return is received and inspected by our team, we will send you an email or SMS to notify you that we have received your returned item.",
        "We will also notify you of the approval or rejection of your refund.",
        "If approved, your refund will be processed automatically to your original method of payment (e.g., bKash, Nagad, Credit Card, or Bank Transfer).",
      ],
    },
    {
      id: "timeline",
      title: "3. Refund Timeline",
      icon: Clock,
      content: [
        "Mobile Banking (bKash/Nagad): 3-5 business days.",
        "Credit/Debit Cards: 7-10 business days, depending on your card issuer's policies.",
        "Cash on Delivery (COD) refunds will be issued via mobile banking or bank transfer, as cash refunds are not available.",
      ],
    },
    {
      id: "exchanges",
      title: "4. Exchanges",
      icon: ShieldCheck,
      content: [
        "We only replace items if they are defective, damaged, or expired at the time of delivery.",
        "If you need to exchange an item for the same product, please contact our customer support team immediately upon receiving your order.",
      ],
    },
    {
      id: "shipping",
      title: "5. Shipping Costs for Returns",
      icon: Truck,
      content: [
        "You will be responsible for paying your own shipping costs for returning your item unless the return is due to our error (e.g., wrong item sent, damaged product).",
        "Original shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.",
      ],
    },
  ],
  support: {
    title: "Need Help?",
    description:
      "If you have any questions about our return and refund policy, please contact us.",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    phone: process.env.NEXT_PUBLIC_CONTACT_NUMBER,
  },
};

export default function ReturnRefundPage() {
  return (
    <div className="bg-muted/30 min-h-screen pb-12">
      {/* Header Section */}
      <div className="bg-brand-gradient text-white py-12 md:py-16">
        <div className="site-container flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {refundPolicyData.header.title}
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl text-sm md:text-base leading-relaxed">
            {refundPolicyData.header.subtitle}
          </p>
          <p className="text-xs text-primary-foreground/70 font-medium mt-4">
            Last Updated: {refundPolicyData.header.lastUpdated}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="site-container -mt-8 relative z-10">
        <div className="bg-background rounded-xl shadow-sm border border-border p-6 md:p-10 max-w-4xl mx-auto space-y-12">
          {refundPolicyData.sections.map((section) => {
            return (
              <section key={section.id} className="space-y-4">
                <SectionHeading title={section.title} />

                <ul className="space-y-3 pl-2">
                  {section.content.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-muted-foreground text-sm md:text-base leading-relaxed"
                    >
                      <span className="mt-2 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          {/* Contact Support Card */}
          <div className="bg-accent/30 rounded-xl p-6 md:p-8 border border-accent text-center space-y-4 mt-8">
            <h3 className="text-lg md:text-xl font-bold text-foreground">
              {refundPolicyData.support.title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              {refundPolicyData.support.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={`mailto:${refundPolicyData.support.email}`}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
              >
                Email Us
              </Link>
              <Link
                href="/contact"
                className="bg-background border border-border text-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-muted transition-colors text-sm"
              >
                Contact Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
