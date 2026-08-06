import { AboutHero } from "@/components/main/about/about-hero";
import { FounderSection } from "@/components/main/about/founder-section";
import { StoryTimeline } from "@/components/main/about/story-section";
import { ValuesSection } from "@/components/main/about/values-section";
import { WhyTrustSection } from "@/components/main/about/why-trust-section";

import { CertificatesSection } from "@/components/main/about/certificate-section";
import { FarmersSection } from "@/components/main/about/farmers-section";
import { FromNatureGallery } from "@/components/main/about/from-nature-gallery";
import { ProductJourneySection } from "@/components/main/about/production-journey-section";
import { StatsBar } from "@/components/main/about/stats-bar";
import { TestimonialsSection } from "@/components/main/about/testimonial-section";
import { CtaBanner } from "@/components/main/common/CtaBanner";
import { FaqAccordion } from "@/components/main/common/FaqAccordion";
import { Suspense } from "react";
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <AboutHero />
      <StoryTimeline />
      <FounderSection />
      <ValuesSection />
      <WhyTrustSection />
      <ProductJourneySection />
      <StatsBar />
      <FarmersSection />
      <CertificatesSection />
      <Suspense>
        <TestimonialsSection />
      </Suspense>

      <FromNatureGallery />
      <FaqAccordion />
      <CtaBanner />
    </main>
  );
}
