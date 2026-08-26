import { AboutHero } from "@/components/main/about/about-hero";
import { StoryTimeline } from "@/components/main/about/story-section";
import { ValuesSection } from "@/components/main/about/values-section";
import { WhyTrustSection } from "@/components/main/about/why-trust-section";

import { AboutFaqSection } from "@/components/main/about/faq-section";
import { ProductJourneySection } from "@/components/main/about/production-journey-section";
import { StatsBar } from "@/components/main/about/stats-bar";
import { TestimonialsSection } from "@/components/main/about/testimonial-section";
import { CtaBanner } from "@/components/main/common/CtaBanner";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "About MST Bazar | Trusted Products Delivered Bangladesh",
  },
  description:
    "Learn how MST Bazar sourcing trusted, natural grocery products and serves customers doorstep with quality, care, easy ordering, and delivery across Bangladesh.",
  keywords: [
    "MST Bazar",
    "About MST Bazar",
    "Trusted Products",
    "Natural Grocery Products",
    "Quality Essentials",
    "Easy Ordering",
    "Nationwide Delivery",
  ],
};
export default function AboutPage() {
  return (
    <main className="bg-background">
      <AboutHero />
      <StoryTimeline />
      <ValuesSection />
      <WhyTrustSection />
      <ProductJourneySection />
      <StatsBar />
      <Suspense>
        <TestimonialsSection />
      </Suspense>
      <AboutFaqSection />
      <CtaBanner />
    </main>
  );
}
