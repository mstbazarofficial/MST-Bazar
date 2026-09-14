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
    title: "গোপনীয়তা নীতি",
    subtitle:
      "MSTbazar (mstbazar.com)-এ গ্রাহকের ব্যক্তিগত তথ্যের সুরক্ষা এবং গোপনীয়তা রক্ষা করাকে আমরা একটি পবিত্র 'আমানত' হিসেবে গণ্য করি। আমাদের ওয়েবসাইট ব্যবহারের সময় আপনার তথ্য কীভাবে সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখা হয়—তা স্পষ্টভাবে তুলে ধরতে এই গোপনীয়তা নীতি প্রণয়ন করা হয়েছে।",
    lastUpdated: "August 12, 2026",
  },
  sections: [
    {
      id: "information-collection",
      title: "১. আমরা কী ধরনের তথ্য সংগ্রহ করি? (Information We Collect)",
      icon: Database,
      content: [
        "ব্যক্তিগত পরিচয়: আপনার নাম।",
        "যোগাযোগের তথ্য: মোবাইল নম্বর ও ইমেইল অ্যাড্রেস।",
        "ডেলিভারির ঠিকানা: পণ্য পৌঁছে দেওয়ার পূর্ণাঙ্গ ঠিকানা এবং জেলা/থানা।",
        "অর্ডার হিস্ট্রি: পূর্বে ক্রয়কৃত পণ্যের বিবরণ ও লেনদেনের সাধারণ তথ্য।",
        "বিশেষ দ্রষ্টব্য: আমরা গ্রাহকের কোনো প্রকার স্পর্শকাতর আর্থিক তথ্য (যেমন: ডেবিট/ক্রেডিট কার্ডের পিন, বিকাশ/নগদ অ্যাকাউন্টের ওটিপি বা পাসওয়ার্ড) সংগ্রহ বা সংরক্ষণ করি না।",
      ],
    },
    {
      id: "information-use",
      title:
        "২. সংগৃহীত তথ্য কীভাবে ব্যবহার করা হয়? (How We Use Your Information)",
      icon: FileText,
      content: [
        "আপনার অর্ডার নিশ্চিতকরণ, প্রক্রিয়াজাতকরণ ও দ্রুত ডেলিভারি সম্পন্ন করতে।",
        "অর্ডার সংক্রান্ত আপডেট বা স্ট্যাটাস এসএমএস/কলের মাধ্যমে জানাতে।",
        "কাস্টমার সাপোর্ট ও বিক্রয়োত্তর সেবা নিশ্চিত করতে।",
        "আমাদের নতুন পণ্য, বিশেষ ছাড় বা সেবার মান উন্নয়নের প্রয়োজনীয় নোটিফিকেশন পাঠাতে (যদি আপনি সম্মত থাকেন)।",
      ],
    },
    {
      id: "information-sharing",
      title: "৩. তথ্যের নিরাপত্তা ও আমানতদারিতা (Data Security & Trust)",
      icon: Share2,
      content: [
        "কোনো তথ্য বিক্রি বা শেয়ার নয়: বাণিজ্যিক উদ্দেশ্যে কোনো তৃতীয় পক্ষ, বিজ্ঞাপনদাতা বা এজেন্সির কাছে আপনার ব্যক্তিগত তথ্য বিক্রি, ভাড়া বা হস্তান্তর করা সম্পূর্ণ নিষিদ্ধ।",
        "লজিস্টিকস শেয়ারিং: কেবল ডেলিভারি সম্পন্ন করার স্বার্থে বিশ্বস্ত কুরিয়ার পার্টনারদের সাথে প্রয়োজনীয় নাম, ঠিকানা ও ফোন নম্বর শেয়ার করা হয়।",
        "নিরাপদ প্রযুক্তি: ওয়েবসাইটের সব ধরনের লেনদেন ও ডেটা ট্রান্সফার এনক্রিপ্টেড (SSL Secured) সুরক্ষিত সার্ভারে সংরক্ষিত থাকে।",
      ],
    },
    {
      id: "data-security",
      title: "৪. কুকিজ ও ট্র্যাকিং পলিসি (Cookies Policy)",
      icon: Shield,
      content: [
        "ওয়েবসাইটের গতি বাড়ানো, কার্ট মেমোরি সংরক্ষণ এবং ইউজার এক্সপেরিয়েন্স উন্নত করতে আমরা স্ট্যান্ডার্ড ইন্টারনেট 'Cookies' প্রযুক্তি ব্যবহার করি। আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে যেকোনো সময় কুকিজ নিষ্ক্রিয় করতে পারেন।",
      ],
    },
    {
      id: "cookies",
      title: "৫. গ্রাহকের অধিকার (Customer Rights)",
      icon: Cookie,
      content: [
        "আপনি যেকোনো সময় আপনার সংরক্ষিত ব্যক্তিগত তথ্য পরিবর্তন, সংশোধন বা ডিলিট করার অনুরোধ জানাতে পারেন।",
        "প্রমোশনাল মেসেজ বা অফার সংক্রান্ত নোটিফিকেশন গ্রহণ না করতে চাইলে তা আনসাবস্ক্রাইব করার পূর্ণ অধিকার আপনার রয়েছে।",
      ],
    },
  ],
  support: {
    title: "গোপনীয়তা সংক্রান্ত জিজ্ঞাসা?",
    description:
      "আমাদের গোপনীয়তা নীতি সম্পর্কে কোনো জিজ্ঞাসা বা তথ্যের সুরক্ষা সংক্রান্ত বিষয়ে থাকলে আমাদের সাথে যোগাযোগ করুন।",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    phone: process.env.NEXT_PUBLIC_CONTACT_NUMBER,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-muted/30 pb-12">
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
