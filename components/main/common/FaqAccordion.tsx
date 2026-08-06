import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import HeadLine from "./HeadLine";

const LEFT_FAQS = [
  {
    id: "item-1",
    question: "Are your products 100% natural?",
    answer:
      "Yes, all our products are 100% natural, pure, and directly sourced from organic farms and trusted beekeepers without any chemical processing.",
  },
  {
    id: "item-2",
    question: "How do you ensure product quality?",
    answer:
      "We perform strict quality control and lab tests for every batch before packaging to ensure maximum safety, taste, and purity.",
  },
  {
    id: "item-3",
    question: "Do you use any preservatives?",
    answer:
      "No, we strictly avoid any artificial preservatives, synthetic colors, or chemical additives in all of our food items.",
  },
];

const RIGHT_FAQS = [
  {
    id: "item-4",
    question: "How long does delivery take?",
    answer:
      "Inside Dhaka delivery takes 24–48 hours, while delivery across other districts outside Dhaka usually takes 2–4 business days.",
  },
  {
    id: "item-5",
    question: "Do you deliver outside Dhaka?",
    answer:
      "Yes! We offer nationwide doorstep delivery coverage across all 64 districts in Bangladesh.",
  },
  {
    id: "item-6",
    question: "How can I place an order?",
    answer:
      "You can place an order directly on our website, select your items, fill in your delivery details, and choose Cash on Delivery or digital payment.",
  },
];

export function FaqAccordion() {
  return (
    <div className="space-y-6 site-container section-y">
      {/* Section Header */}
      <HeadLine title="Frequently Asked Questions" />

      {/* 2-Column FAQ Layout with shadcn Accordion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Left Column */}
        <Accordion className="space-y-3">
          {LEFT_FAQS.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b-0"
            >
              <AccordionTrigger className="p-4 sm:p-4.5 hover:no-underline text-xs sm:text-sm font-bold text-gray-900 leading-snug hover:bg-stone-50/50 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-xs text-gray-600 font-medium leading-relaxed border-t border-gray-50 pt-2.5 bg-gray-50/30">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Right Column */}
        <Accordion className="space-y-3">
          {RIGHT_FAQS.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b-0"
            >
              <AccordionTrigger className="p-4 sm:p-4.5 hover:no-underline text-xs sm:text-sm font-bold text-gray-900 leading-snug hover:bg-stone-50/50 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-xs text-gray-600 font-medium leading-relaxed border-t border-gray-50 pt-2.5 bg-gray-50/30">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
