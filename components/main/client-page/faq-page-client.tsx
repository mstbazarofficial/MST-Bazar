"use client";

import { SectionHeading } from "@/components/main/common/layout/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE_CONFIG } from "@/constants/site";
import {
  HelpCircle,
  Mail,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqData = {
  header: {
    title: "Frequently Asked Questions",
    subtitle:
      "Find answers to common questions about our organic products, ordering, payment methods, and nationwide delivery.",
    lastUpdated: "August 12, 2026",
  },
  categories: [
    {
      id: "products",
      title: "Products & Quality",
      icon: ShieldCheck,
      faqs: [
        {
          q: "Are MST Bazar products 100% natural and pure?",
          a: "Yes, all our products—including honey, mustard oil, ghee, and organic items—are sourced directly from verified farmers and beekeepers. They are 100% pure, unadulterated, and free from synthetic preservatives.",
        },
        {
          q: "How do you test product quality?",
          a: "Every batch undergoes rigorous quality control checks and accredited laboratory testing for chemical, moisture, and purity standards before being packaged.",
        },
        {
          q: "How should I store honey and organic ghee?",
          a: "Store honey at room temperature in a dry place away from direct sunlight. Do not refrigerate honey as it crystallizes naturally. Ghee should be stored in a cool, airtight container.",
        },
      ],
    },
    {
      id: "orders",
      title: "Orders & Shipping",
      icon: Truck,
      faqs: [
        {
          q: "How long does doorstep delivery take across Bangladesh?",
          a: "Inside Dhaka, delivery typically takes 24–48 hours. For all other districts across Bangladesh, delivery takes 2–4 business days via express courier services.",
        },
        {
          q: "What are the delivery charges?",
          a: "We charge a flat standard rate of ৳60 inside Dhaka and ৳120 outside Dhaka. We also offer free delivery on orders over a specified amount.",
        },
        {
          q: "Can I inspect the product before making a payment?",
          a: "Yes! We support doorstep inspection for cash-on-delivery orders. You can check the product packaging thoroughly upon delivery before paying the delivery agent.",
        },
      ],
    },
    {
      id: "payment",
      title: "Payment & Returns",
      icon: ShoppingBag,
      faqs: [
        {
          q: "What payment options do you support?",
          a: "We support Cash on Delivery (COD), Mobile Financial Services (bKash, Nagad, Rocket), and major credit/debit cards.",
        },
        {
          q: "What is your return and refund policy?",
          a: "If you receive a damaged, unsealed, or incorrect item, notify our delivery agent or customer care immediately. We offer a 100% replacement or full refund within 3 days of delivery.",
        },
      ],
    },
  ],
  support: {
    title: "Still Have Questions?",
    description:
      "Can’t find the answer you’re looking for? Our customer care team is ready to help you every day.",
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
  },
};

export default function FaqPageClient() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-muted/30 pb-12">
      {/* Header Section */}
      <div className="bg-brand-gradient text-white py-12 md:py-16">
        <div className="site-container flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {faqData.header.title}
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl text-sm md:text-base leading-relaxed">
            {faqData.header.subtitle}
          </p>

          {/* Search Bar Input */}
          <div className="relative w-full max-w-md pt-2">
            <input
              type="text"
              placeholder="Search questions (e.g. delivery, honey, payment)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-foreground pl-10 pr-4 py-3 rounded-lg shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary text-sm"
            />
            <Search className="absolute left-3.5 top-5.5 w-4 h-4 text-muted-foreground" />
          </div>

          <p className="text-xs text-primary-foreground/70 font-medium pt-2">
            Last Updated: {faqData.header.lastUpdated}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="site-container -mt-8 relative z-10">
        <div className="bg-background rounded-xl shadow-sm border border-border p-6 md:p-10 max-w-4xl mx-auto space-y-10">
          {faqData.categories.map((category) => {
            const filteredFaqs = category.faqs.filter(
              (faq) =>
                faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
            );

            if (searchQuery && filteredFaqs.length === 0) return null;

            return (
              <section key={category.id} className="space-y-5">
                <SectionHeading title={category.title} />

                {/* Shadcn Accordion */}
                <Accordion className="w-full space-y-3">
                  {filteredFaqs.map((faq, index) => {
                    const itemId = `${category.id}-${index}`;

                    return (
                      <AccordionItem
                        key={itemId}
                        value={itemId}
                        className="border border-border/80 rounded-lg bg-card px-4 hover:border-primary/40 transition-colors"
                      >
                        <AccordionTrigger className="hover:no-underline text-left font-semibold text-foreground text-sm md:text-base cursor-pointer py-4">
                          <span className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                            {faq.q}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pt-1 pb-4">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </section>
            );
          })}

          {/* Contact Support Card */}
          <div className="bg-accent/30 rounded-xl p-6 md:p-8 border border-accent text-center space-y-4 mt-8">
            <h3 className="text-lg md:text-xl font-bold text-foreground">
              {faqData.support.title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              {faqData.support.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={`mailto:${faqData.support.email}`}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Email Support</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-background border border-border text-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-muted transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4 text-primary" />
                <span>Contact Page</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
