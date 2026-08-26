import { SectionHeading } from "@/components/main/common/layout/section-heading";
import {
  AlertTriangle,
  CheckSquare,
  FileBadge,
  Gavel,
  Scale,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read our Terms & Conditions to understand the rules and regulations for using MST Bazar's website and services.",
  keywords: [
    "MST Bazar",
    "Terms & Conditions",
    "User Agreement",
    "Website Rules",
    "Service Regulations",
    "Customer Support",
    "Online Grocery Shopping",
    "Nationwide Delivery",
  ],
};

// Mock data that can later be replaced with an API call from the backend
const termsData = {
  header: {
    title: "Terms & Conditions",
    subtitle:
      "Please read these terms and conditions carefully before using our website and services.",
    lastUpdated: "August 12, 2026",
  },
  sections: [
    {
      id: "agreement",
      title: "1. Agreement to Terms",
      icon: CheckSquare,
      content: [
        "By accessing and using this website (MST Bazar), you accept and agree to be bound by the terms and provisions of this agreement.",
        "In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.",
        "If you do not agree to abide by these terms, please do not use our service.",
      ],
    },
    {
      id: "user-accounts",
      title: "2. User Accounts",
      icon: FileBadge,
      content: [
        "When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.",
        "You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.",
        "You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.",
      ],
    },
    {
      id: "products-orders",
      title: "3. Products and Orders",
      icon: AlertTriangle,
      content: [
        "All products are subject to availability. We reserve the right to discontinue any product at any time.",
        "We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.",
        "In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the email and/or billing address/phone number provided at the time the order was made.",
      ],
    },
    {
      id: "limitations",
      title: "4. Limitation of Liability",
      icon: Scale,
      content: [
        "In no event shall MST Bazar, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.",
      ],
    },
    {
      id: "governing-law",
      title: "5. Governing Law",
      icon: Gavel,
      content: [
        "These Terms shall be governed and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.",
        "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.",
      ],
    },
  ],
  support: {
    title: "Have Questions?",
    description:
      "If you have any questions or concerns about these Terms & Conditions, please contact us.",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    phone: process.env.NEXT_PUBLIC_CONTACT_NUMBER,
  },
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-muted/30 pb-12">
      {/* Header Section */}
      <div className="bg-brand-gradient text-white py-12 md:py-16">
        <div className="site-container flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {termsData.header.title}
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl text-sm md:text-base leading-relaxed">
            {termsData.header.subtitle}
          </p>
          <p className="text-xs text-primary-foreground/70 font-medium mt-4">
            Last Updated: {termsData.header.lastUpdated}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="site-container -mt-8 relative z-10">
        <div className="bg-background rounded-xl shadow-sm border border-border p-6 md:p-10 max-w-4xl mx-auto space-y-12">
          {termsData.sections.map((section) => {
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
              {termsData.support.title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              {termsData.support.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={`mailto:${termsData.support.email}`}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
              >
                Contact Legal Team
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
