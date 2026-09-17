import { SectionHeading } from "@/components/main/common/layout/section-heading";
import { SITE_CONFIG } from "@/constants/site";
import {
  Clock,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Return & Refund Policy",
  description:
    "Read our Return & Refund Policy to understand how we handle returns, refunds, and exchanges at MST Bazar.",
  keywords: [
    "MST Bazar",
    "Return & Refund Policy",
    "Returns",
    "Refunds",
    "Exchanges",
    "Customer Support",
    "Online Grocery Shopping",
    "Nationwide Delivery",
  ],
};

// Mock data that can later be replaced with an API call from the backend
const refundPolicyData = {
  header: {
    title: "রিটার্ন ও রিফান্ড পলিসি",
    subtitle:
      "MSTbazar-এ আপনার সন্তুষ্টি ও সুস্বাস্থ্যই আমাদের প্রধান অগ্রাধিকার। আমরা সততা ও আমানতদারিতার সাথে প্রতিটি অর্ডার সরবরাহ করে থাকি। তবুও কোনো কারণে পণ্যে সমস্যা থাকলে বা আপনি সন্তুষ্ট না হলে আমাদের সহজ রিটার্ন ও রিফান্ড সুবিধা গ্রহণ করতে পারবেন।",
    lastUpdated: "August 12, 2026",
  },
  sections: [
    {
      id: "return-policy",
      title: "১. ডেলিভারি গ্রহণের সময় করণীয় (On-Spot Checking)",
      icon: RefreshCcw,
      content: [
        "ডেলিভারিম্যানের সামনেই পার্সেল খুলে পণ্যের গুণগত মান, পরিমাণ এবং প্যাকেজিং অক্ষত আছে কি না তা যাচাই করুন।",
        "পণ্যে কোনো দৃশ্যমান ক্ষতি, ভাঙা বা ভুল পণ্য দেখতে পেলে ডেলিভারিম্যানকে তাৎক্ষণিকভাবে অবহিত করে পণ্যটি সরাসরি রিটার্ন করে দিন।",
      ],
    },
    {
      id: "refund-process",
      title: "২. রিটার্ন ও রিপ্লেসমেন্টের শর্তাবলী (Return Conditions)",
      icon: CreditCard,
      content: [
        "পণ্য গ্রহণের পর নিচের যে কোনো সমস্যায় আপনি ২৪ ঘণ্টার মধ্যে আমাদের সাথে যোগাযোগ করে রিটার্ন বা এক্সচেঞ্জ দাবি করতে পারেন।",
        "ডেলিভারির সময় পণ্য ক্ষতিগ্রস্ত, লিক হওয়া বা ভাঙা অবস্থায় পেলে।",
        "পণ্যের গুণগত মানে কোনো সুনির্দিষ্ট সমস্যা বা নষ্ট থাকলে।",
        "অর্ডারের তুলনায় ভুল বা কম পণ্য সরবরাহ করা হলে।",
        "প্যাকেট খোলার সময় বা কোনো ত্রুটি পেলে প্রমাণস্বরূপ একটি স্পষ্ট ছবি বা ছোট ভিডিও ধারণ করে আমাদের ইনবক্স বা হোয়াটসঅ্যাপে পাঠাতে হবে।",
        "বিশেষ দ্রষ্টব্য: খাদ্যপণ্য স্বাস্থ্য ও সুরক্ষার সাথে জড়িত হওয়ায় কাস্টমারের অসাবধানতাবশত ক্ষতি হলে, ব্যবহৃত হলে বা মুখ খোলা থাকলে (গুণগত ত্রুটি ছাড়া) পণ্য রিটার্ন গ্রহণযোগ্য হবে না।",
      ],
    },
    {
      id: "timeline",
      title: "৩. রিফান্ড প্রক্রিয়া (Refund Policy)",
      icon: Clock,
      content: [
        "রিটার্ন ভেরিফিকেশন: রিটার্নকৃত পণ্য আমাদের স্টোরে পৌঁছানোর পর কোয়ালিটি টিম তা যাচাই করবে।",
        "রিফান্ড অনুমোদন: সমস্যা প্রমাণিত হলে পরবর্তী ৩ থেকে ৫ কার্যদিবসের মধ্যে আপনার রিফান্ড প্রসেস করা হবে।",
        "টাকা ফেরতের মাধ্যম: আপনি যে মাধ্যমে পেমেন্ট করেছিলেন (বিকাশ, নগদ, রকেট বা ব্যাংক ট্রান্সফার), ঠিক সেই মাধ্যমেই পুরো টাকা ফেরত পাঠানো হবে।",
        "অনলাইন পেমেন্টের ক্ষেত্রে রিফান্ডের জন্য কোনো অতিরিক্ত সার্ভিস চার্জ কাটা হবে না।",
      ],
    },
    {
      id: "exchanges",
      title: "৪. রিপ্লেসমেন্ট সুবিধা (Free Replacement)",
      icon: ShieldCheck,
      content: [
        "যদি আপনি রিফান্ডের পরিবর্তে নতুন পণ্য নিতে চান, তবে আমাদের টিম কোনো অতিরিক্ত ডেলিভারি চার্জ ছাড়াই দ্রুততম সময়ে আপনাকে ফ্রেশ পণ্য রিপ্লেসমেন্ট পৌঁছে দেবে।",
      ],
    },
    {
      id: "shipping",
      title: "৫. অর্ডার বাতিল (Order Cancellation)",
      icon: Truck,
      content: [
        "পার্সেল কুরিয়ারে হ্যান্ডওভার করার আগ পর্যন্ত আপনি ফ্রিতে অর্ডার বাতিল করতে পারবেন।",
        "পার্সেল ডেলিভারির জন্য বের হয়ে যাওয়ার পর অযৌক্তিক কারণে অর্ডার বাতিল করা কাম্য নয়।",
      ],
    },
  ],
  support: {
    title: "সাহায্য দরকার?",
    description:
      "আমাদের রিটার্ন ও রিফান্ড পলিসি সম্পর্কে আপনার কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।",
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
  },
};

export default function ReturnRefundPage() {
  return (
    <div className="bg-muted/30 pb-12">
      {/* Header Section */}
      <div className="bg-brand-gradient text-white py-12 md:py-16">
        <div className="site-container flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {refundPolicyData.header.title}
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl text-sm md:text-base leading-relaxed">
            {refundPolicyData.header.subtitle}
          </p>
          <p className="text-xs text-primary-foreground/70 font-medium mt-4">
            Last Updated: {refundPolicyData.header.lastUpdated}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="site-container -mt-8 relative z-10">
        <div className="bg-background rounded-xl shadow-sm border border-border p-6 md:p-10 max-w-4xl mx-auto space-y-12">
          {refundPolicyData.sections.map((section) => {
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
              {refundPolicyData.support.title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              {refundPolicyData.support.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={`mailto:${refundPolicyData.support.email}`}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
              >
                Email Us
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
