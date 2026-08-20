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
  title: "About Us",
  description:
    "Learn about MST Bazar, your trusted online grocery store in Bangladesh. Discover our story, values, and commitment to delivering fresh, natural, and healthy products straight to your doorstep.",
};
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
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
