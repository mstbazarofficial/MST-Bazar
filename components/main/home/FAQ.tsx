import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "item-1",
    question: "How do I place an order on MST Bazar?",
    answer:
      "Simply browse our product categories, add your desired items to the cart, click 'Checkout', enter your delivery details, select a payment method, and click 'Place Order'.",
  },
  {
    id: "item-2",
    question: "What are the delivery charges and delivery times?",
    answer:
      "Delivery fee inside Dhaka is ৳60 and outside Dhaka is ৳120. Inside Dhaka orders are delivered within 24–48 hours. Orders above ৳999 qualify for Free Delivery!",
  },
  {
    id: "item-3",
    question: "Which payment methods are supported?",
    answer:
      "We accept Cash on Delivery (COD), Mobile Banking (bKash, Nagad, Rocket), as well as Visa, Mastercard, and AMEX debit/credit cards.",
  },
  {
    id: "item-4",
    question: "What is your return and refund policy?",
    answer:
      "You can inspect your items in front of the delivery agent. If any product is damaged or unsatisfactory, you can return it instantly with no extra charge.",
  },
  {
    id: "item-5",
    question: "How can I track my order?",
    answer:
      "Once your order is confirmed, you will receive a Tracking ID via SMS. Visit our 'Track Order' page to monitor live updates on your delivery.",
  },
  {
    id: "item-6",
    question: "Are your products 100% organic and fresh?",
    answer:
      "Yes, all MST Bazar products are directly sourced from verified organic farms and trusted suppliers to guarantee maximum freshness and quality.",
  },
];

export default function FaqSection() {
  return (
    <section className="w-full site-container section-y">
      <div className=" space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>Have Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Find quick answers to common questions about shopping, shipping, and
            payments at MST Bazar.
          </p>
        </div>

        {/* Accordion Component adhering strictly to shadcn/ui primitive structure */}
        <div className="bg-card border border-border/60 rounded-md p-3 sm:p-6 shadow-2xs max-w-5xl mx-auto">
          <Accordion className="w-full space-y-1">
            {FAQ_ITEMS.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border-b border-border/60 last:border-b-0 px-2 sm:px-4"
              >
                <AccordionTrigger className="text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors text-left py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
