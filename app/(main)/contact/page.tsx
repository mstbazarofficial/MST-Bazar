import { SectionHeading } from "@/components/main/common/layout/section-heading";
import { ContactFormSection } from "@/components/main/contact/ContactFormSection";
import { ContactInfoSection } from "@/components/main/contact/ContactInfoSection";
import { FAQSection } from "@/components/main/contact/FAQSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Us | Fresh Grocery Products & Honey in Bangladesh",
  },
  description:
    "Contact MST Bazar for any inquiries or support. We're here to help with fresh grocery products and honey delivery across Bangladesh.",
  keywords: [
    "MST Bazar",
    "Contact Us",
    "Fresh Grocery Products",
    "Honey in Bangladesh",
    "Customer Support",
    "Inquiries",
    "Online Grocery Shopping",
    "Nationwide Delivery",
  ],
};
export default function ContactPage() {
  return (
    <div className="bg-muted site-container pb-12">
      <div className="text-sm  py-4 flex items-center gap-2">
        <span className="hover:text-primary-dark text-muted-foreground cursor-pointer">
          Home
        </span>
        <span className="text-muted-foreground">›</span>
        <span className="text-foreground font-medium">Contact Us</span>
      </div>

      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        <SectionHeading title="Contact Us" highlightPositions={[1, 2]} />
      </h1>

      {/* Main Content (Contact Info & Form) */}
      <div className="bg-card rounded-md shadow-sm border border-border p-5 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left Column - 40% width on large screens */}
          <div className="lg:col-span-2">
            <ContactInfoSection />
          </div>

          {/* Right Column - 60% width on large screens */}
          <div className="lg:col-span-3 lg:border-l lg:border-primary/45 lg:pl-12">
            <ContactFormSection />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
