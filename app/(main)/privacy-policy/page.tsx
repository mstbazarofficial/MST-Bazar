import { SectionHeading } from "@/components/main/common/layout/section-heading";
import { Cookie, Database, FileText, Share2, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Read our Privacy Policy to understand how we collect, use, and protect your personal information at MST Bazar.",
  keywords: [
    "MST Bazar",
    "Privacy Policy",
    "Data Protection",
    "Personal Information",
    "Online Grocery Shopping",
    "Nationwide Delivery",
  ],
};

// Mock data that can later be replaced with an API call from the backend
const privacyPolicyData = {
  header: {
    title: "Privacy Policy",
    subtitle:
      "We value your privacy. Read our policy below to understand how we collect, use, and protect your personal information.",
    lastUpdated: "August 12, 2026",
  },
  sections: [
    {
      id: "information-collection",
      title: "1. Information Collection",
      icon: Database,
      content: [
        "We collect information you provide directly to us, such as when you create or modify your account, place an order, contact customer support, or otherwise communicate with us.",
        "This information may include: name, email address, phone number, delivery address, payment method details, and any other information you choose to provide.",
        "We also automatically collect certain information when you visit our site, including your IP address, browser type, and operating system.",
      ],
    },
    {
      id: "information-use",
      title: "2. Use of Information",
      icon: FileText,
      content: [
        "We may use the information we collect about you to provide, maintain, and improve our services.",
        "To process transactions and send you related information, including order confirmations, delivery updates, and receipts.",
        "To send you technical notices, security alerts, and support messages.",
        "To respond to your comments, questions, and requests, and provide customer service.",
        "To communicate with you about products, services, offers, and promotions offered by MST Bazar (if you have opted in).",
      ],
    },
    {
      id: "information-sharing",
      title: "3. Sharing of Information",
      icon: Share2,
      content: [
        "We may share your information with trusted third-party vendors and service providers who need access to such information to carry out work on our behalf (e.g., delivery partners like Pathao/RedX, payment gateways like bKash).",
        "We may disclose your information in response to a request by a competent authority if we believe disclosure is in accordance with, or required by, any applicable law or legal process.",
        "We strictly do not sell, rent, or trade your personal information to third parties for marketing purposes.",
      ],
    },
    {
      id: "data-security",
      title: "4. Data Security",
      icon: Shield,
      content: [
        "We implement robust security measures to protect your personal information from unauthorized access, loss, misuse, alteration, or destruction.",
        "All payment transactions are encrypted and processed through secure, compliant third-party payment gateways. We do not store your credit card or PIN details on our servers.",
        "While we strive to protect your data, no method of transmission over the Internet is 100% secure. Therefore, we cannot guarantee its absolute security.",
      ],
    },
    {
      id: "cookies",
      title: "5. Cookies and Tracking",
      icon: Cookie,
      content: [
        "We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and track the activity on our website.",
        "Cookies are small files stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
        "Please note that if you disable cookies, some features of our website (like your shopping cart) may not function properly.",
      ],
    },
  ],
  support: {
    title: "Privacy Concerns?",
    description:
      "If you have any questions or concerns about this Privacy Policy or how we handle your data, please reach out to us.",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    phone: process.env.NEXT_PUBLIC_CONTACT_NUMBER,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-muted/30 min-h-screen pb-12">
      {/* Header Section */}
      <div className="bg-brand-gradient text-white py-12 md:py-16">
        <div className="site-container flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {privacyPolicyData.header.title}
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl text-sm md:text-base leading-relaxed">
            {privacyPolicyData.header.subtitle}
          </p>
          <p className="text-xs text-primary-foreground/70 font-medium mt-4">
            Last Updated: {privacyPolicyData.header.lastUpdated}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="site-container -mt-8 relative z-10">
        <div className="bg-background rounded-xl shadow-sm border border-border p-6 md:p-10 max-w-4xl mx-auto space-y-12">
          {privacyPolicyData.sections.map((section) => {
            return (
              <section key={section.id} className="space-y-4">
                <div className="flex items-start gap-3 border-b border-border pb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <section.icon className="w-5 h-5" />
                  </div>
                  <SectionHeading title={section.title} />
                </div>

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
              {privacyPolicyData.support.title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              {privacyPolicyData.support.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={`mailto:${privacyPolicyData.support.email}`}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
              >
                Email Privacy Team
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
