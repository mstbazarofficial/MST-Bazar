import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { SectionHeading } from "../common/layout/section-heading";

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
    <section id="faq" className="w-full site-container section-y">
      {/* 1. Full-width Section Heading */}
      <SectionHeading
        title="Frequently Asked Questions"
        highlightPositions={[3]}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* 2. Left Side: Subtext & Fixed Size Image (Hidden on Mobile) */}
        <div className="hidden md:flex md:col-span-5 flex-col space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Find quick answers to common questions about shopping, shipping, and
            payments at MST Bazar. If you need further assistance, feel free to
            reach out to our support team.
          </p>
          <div className="w-full max-w-xs mx-auto pt-2">
            <Image
              src="/assets/faq.svg"
              alt="Frequently Asked Questions"
              width={320}
              height={260}
              className="w-full h-auto object-contain"
              style={{ height: "auto" }}
              priority
            />
          </div>
        </div>

        {/* 3. Right Side: Each FAQ item rendered as an individual box */}
        <div className="col-span-1 md:col-span-7">
          <Accordion className="w-full space-y-3">
            {FAQ_ITEMS.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-card border border-border/60 rounded-lg px-4 sm:px-5 shadow-2xs hover:border-primary/50 transition-all duration-200 data-[state=open]:border-primary data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors text-left py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed pb-4 pt-0">
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
