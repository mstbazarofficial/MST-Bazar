import { SectionHeading } from "@/components/main/common/layout/section-heading";
import { SITE_CONFIG } from "@/constants/site";
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
    title: "শর্তাবলী",
    subtitle:
      "আমাদের ওয়েবসাইট ও সেবা ব্যবহারের আগে অনুগ্রহ করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন।",
    lastUpdated: "August 12, 2026",
  },
  sections: [
    {
      id: "agreement",
      title: "১. শর্তাবলীতে সম্মতি",
      icon: CheckSquare,
      content: [
        "এই ওয়েবসাইট (MST Bazar) ব্যবহারের মাধ্যমে আপনি এই চুক্তির শর্তাবলী মেনে নিচ্ছেন এবং তা মেনে চলতে সম্মত হচ্ছেন।",
        "এছাড়াও, এই ওয়েবসাইটের নির্দিষ্ট কোনো সেবা ব্যবহারের সময় সেই সেবার জন্য প্রযোজ্য যেকোনো নিয়মাবলী বা গাইডলাইন আপনার জন্য প্রযোজ্য হবে।",
        "আপনি যদি এই শর্তাবলী মেনে চলতে সম্মত না হন, তাহলে অনুগ্রহ করে আমাদের সেবা ব্যবহার করবেন না।",
      ],
    },
    {
      id: "user-accounts",
      title: "২. ব্যবহারকারীর অ্যাকাউন্ট",
      icon: FileBadge,
      content: [
        "আমাদের সাথে অ্যাকাউন্ট তৈরি করার সময় আপনাকে অবশ্যই সঠিক, সম্পূর্ণ এবং হালনাগাদ তথ্য প্রদান করতে হবে। তা না করলে তা শর্তাবলী লঙ্ঘন হিসেবে বিবেচিত হবে।",
        "সেবা ব্যবহারের জন্য আপনার পাসওয়ার্ড সুরক্ষিত রাখার দায়িত্ব আপনার এবং আপনার পাসওয়ার্ড ব্যবহার করে সংঘটিত যেকোনো কার্যকলাপের জন্য আপনি দায়ী থাকবেন।",
        "আপনার পাসওয়ার্ড কোনো তৃতীয় পক্ষের কাছে প্রকাশ না করতে আপনি সম্মত হচ্ছেন। কোনো নিরাপত্তা লঙ্ঘন বা অননুমোদিত ব্যবহার সম্পর্কে জানতে পারলে অবিলম্বে আমাদের জানাতে হবে।",
      ],
    },
    {
      id: "products-orders",
      title: "৩. পণ্য ও অর্ডার",
      icon: AlertTriangle,
      content: [
        "সকল পণ্য প্রাপ্যতা সাপেক্ষে সরবরাহ করা হয়। যেকোনো পণ্য যেকোনো সময় বন্ধ করার অধিকার আমরা সংরক্ষণ করি।",
        "আপনার দেওয়া যেকোনো অর্ডার প্রত্যাখ্যান করার অধিকার আমরা সংরক্ষণ করি। আমরা আমাদের একমাত্র বিবেচনায় প্রতি ব্যক্তি, প্রতি পরিবার বা প্রতি অর্ডারে ক্রয়কৃত পরিমাণ সীমিত বা বাতিল করতে পারি।",
        "কোনো অর্ডার পরিবর্তন বা বাতিল করা হলে, অর্ডার প্রদানের সময় দেওয়া ইমেইল এবং/অথবা ফোন নম্বরের মাধ্যমে আপনাকে জানানোর চেষ্টা করা হতে পারে।",
      ],
    },
    {
      id: "limitations",
      title: "৪. দায়বদ্ধতার সীমাবদ্ধতা",
      icon: Scale,
      content: [
        "কোনো অবস্থাতেই MST Bazar, এর পরিচালক, কর্মচারী, অংশীদার, প্রতিনিধি, সরবরাহকারী বা সংশ্লিষ্ট প্রতিষ্ঠান পরোক্ষ, আকস্মিক, বিশেষ, পরিণতিমূলক বা শাস্তিমূলক ক্ষতির জন্য দায়ী থাকবে না, যার মধ্যে রয়েছে মুনাফা, ডেটা, ব্যবহার, সুনাম বা অন্যান্য অস্পষ্ট ক্ষতি, যা আমাদের সেবা ব্যবহার বা ব্যবহার করতে না পারার কারণে ঘটতে পারে।",
      ],
    },
    {
      id: "governing-law",
      title: "৫. প্রযোজ্য আইন",
      icon: Gavel,
      content: [
        "এই শর্তাবলী বাংলাদেশের প্রচলিত আইন অনুযায়ী পরিচালিত ও ব্যাখ্যা করা হবে।",
        "এই শর্তাবলীর কোনো অধিকার বা বিধান প্রয়োগ না করা তার পরিত্যাগ হিসেবে বিবেচিত হবে না। কোনো আদালত কর্তৃক এই শর্তাবলীর কোনো বিধান অবৈধ বা অপ্রযোজ্য বলে বিবেচিত হলে, বাকি বিধানগুলো কার্যকর থাকবে।",
      ],
    },
  ],
  support: {
    title: "কোনো প্রশ্ন আছে?",
    description:
      "এই শর্তাবলী সম্পর্কে আপনার কোনো প্রশ্ন বা উদ্বেগ থাকলে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।",
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
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
