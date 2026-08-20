import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { SectionHeading } from "../common/layout/section-heading";

export function FAQSection() {
  const faqs = [
    {
      icon: Truck,
      question: "How do I track my order?",
      answer:
        "You can track your order status in real-time by entering your Order ID in the contact form or visiting your account dashboard.",
    },
    {
      icon: RefreshCcw,
      question: "What is your return policy?",
      answer:
        "We offer a 7-day hassle-free return policy for damaged, defective, or incorrect items received.",
    },
    {
      icon: ShieldCheck,
      question: "Which payment methods are accepted?",
      answer:
        "We accept Cash on Delivery (COD), Mobile Banking (bKash/Nagad), and major Debit/Credit cards.",
    },
    {
      icon: HelpCircle,
      question: "How do I cancel or change an order?",
      answer:
        "Orders can be canceled or updated before they are dispatched by reaching out to our support team with your Order ID.",
    },
  ];

  return (
    <div className="mt-16">
      <SectionHeading
        title="Frequently Asked Questions"
        highlightPositions={[3]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {faqs.map((faq, idx) => (
          <Card
            key={idx}
            className="border border-border/60 shadow-xs hover:shadow-md transition-all duration-200 rounded-md bg-card"
          >
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
                <faq.icon className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-bold text-foreground text-base mb-2">
                  {faq.question}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
