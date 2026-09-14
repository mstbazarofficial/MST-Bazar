import { Leaf, Package, Scale, ShieldCheck } from "lucide-react";
import { Metadata } from "next";
import {
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

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
  const features = [
    {
      icon: Leaf,
      enSubtitle: "From nature to your plate",
      title: "মাঠ থেকে আপনার থালায়",
      desc: "কোনো তৃতীয় পক্ষ বা মধ্যস্বত্বভোগী নয়; আমাদের প্রতিটি খাদ্যপণ্য সরাসরি ফসলের মাঠ, নির্ভরযোগ্য খামার ও মূল প্রাকৃতিক উৎস থেকে নিজস্ব কঠোর তদারকিতে সংগ্রহ করে আপনার খাবার টেবিলে পৌঁছে দেওয়া হয়।",
    },
    {
      icon: ShieldCheck,
      enSubtitle: "100% chemical & preservative free",
      title: "শতভাগ রাসায়নিক ও প্রিজারভেটিভমুক্ত",
      desc: "কোনো কৃত্রিম রং, ক্ষতিকর ফ্লেভার বা রাসায়নিক প্রিজারভেটিভের স্পর্শ নেই। প্রকৃতি থেকে যেভাবে আসে, ঠিক সেভাবেই পৌঁছে যায় আপনার ঘরে।",
    },
    {
      icon: Scale,
      enSubtitle: "Ethical & sunnah-compliant business",
      title: "নৈতিক ও সুন্নাহ সম্মত ব্যবসা",
      desc: "ওজনে শতভাগ সঠিক পরিমাপ এবং পণ্যের সঠিক গুণমান বজায় রেখে সততা ও আমানতদারিতার সাথে ব্যবসা পরিচালনা করাই আমাদের অঙ্গীকার।",
    },
    {
      icon: Package,
      enSubtitle: "Hygiene & premium packaging",
      title: "স্বাস্থ্যবিধি ও প্রিমিয়াম প্যাকেজিং",
      desc: "সর্বোচ্চ স্বাস্থ্যবিধি মেনে আধুনিক ফুড-গ্রেড প্যাকেজিংয়ের মাধ্যমে খাবারের আসল সতেজতা ও পুষ্টিমান অক্ষুণ্ণ রাখা হয়।",
    },
  ];

  return (
    <main className=" bg-[#F7F2E3] text-[#20281D]">
      {/* Hero Header */}
      <header className="bg-[#243B2D] text-[#F7F2E3] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#DDAE5C] text-sm uppercase font-medium tracking-widest mb-4 flex items-center justify-center gap-3">
            <span className="w-7 h-px bg-[#DDAE5C]/50"></span>
            আমাদের সম্পর্কে
            <span className="w-7 h-px bg-[#DDAE5C]/50"></span>
          </p>

          <blockquote className="my-4">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold leading-relaxed">
              “হে মানবজাতি! জমিনে যা কিছু হালাল ও পবিত্র রয়েছে, তা থেকে তোমরা
              আহার করো।”
            </h1>
            <p className="text-[#DDAE5C] text-sm sm:text-base mt-2 font-medium">
              (সূরা বাক্বারা: ১৬৮)
            </p>
          </blockquote>

          <div className="my-6">
            <svg
              className="w-8 h-8 mx-auto text-[#DDAE5C]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <path d="M12 21V6" />
              <path d="M12 12c0-3.5 2.2-5.5 5.5-6-0.5 3.3-2 5.5-5.5 6Z" />
              <path d="M12 16c0-3.2-2-5-5-5.5 0.4 3 1.8 5 5 5.5Z" />
            </svg>
          </div>

          <p className="text-lg sm:text-xl text-[#F7F2E3]/90 leading-relaxed font-light">
            মহান আল্লাহর এই অমূল্য নির্দেশকে ধারণ করে — বিশুদ্ধতার অন্য নাম{" "}
            <strong className="font-serif text-[#DDAE5C] font-semibold">
              MSTbazar
            </strong>
            ।
          </p>
        </div>
      </header>

      {/* Story Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#8F6423] font-serif italic text-sm font-medium tracking-wide block mb-1">
            Our story &amp; philosophy
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif mb-8 text-[#20281D]">
            আমাদের গল্প ও দর্শন
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-6 text-[#5C6353] text-base sm:text-lg leading-relaxed">
              <p>
                সুস্থ ও সুন্দর জীবনের মূল ভিত্তি হলো বিশুদ্ধ খাদ্য। কিন্তু
                বর্তমান সময়ে ভেজাল, কৃত্রিম উপাদান ও ক্ষতিকর রাসায়নিকের ভিড়ে
                পরিবারের জন্য নিরাপদ খাবার খুঁজে পাওয়া এক বড় দুশ্চিন্তার
                বিষয়। ইসলাম আমাদের নির্দেশ দিয়েছে কেবল হালাল উপার্জন নয়, বরং
                'তৈয়্যিব' (পবিত্র ও কল্যাণকর) খাবার গ্রহণ করতে।
              </p>
              <p>
                এই দায়িত্ববোধ ও আমানতদারিতার জায়গা থেকেই MSTbazar
                (mstbazar.com)-এর পথচলা। আমরা ব্যবসাকে কেবল মুনাফার চোখে দেখি
                না; প্রতিটি পরিবারের খাবার টেবিলে মহান আল্লাহর দেওয়া নেয়ামতের
                আদি রূপ ও পুষ্টিগুণ পৌঁছে দেওয়াকেই আমাদের নৈতিক দায়িত্ব মনে
                করি।
              </p>
            </div>

            <div className="md:col-span-4 flex justify-center text-[#8F6423]">
              <svg
                className="w-28 h-40 opacity-85"
                viewBox="0 0 160 220"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M80 210V30" />
                <path d="M80 60c0-22 16-34 40-40-4 24-16 38-40 40Z" />
                <path d="M80 95c0-22-16-32-40-37 5 22 15 34 40 37Z" />
                <path d="M80 130c0-20 14-30 36-34-4 22-14 32-36 34Z" />
                <path d="M80 165c0-18-13-27-33-31 4 19 13 29 33 31Z" />
                <circle cx="80" cy="20" r="6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-[#EEE4C6] py-16 sm:py-24 px-4 sm:px-6 border-t border-b border-[#20281D]/10">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#8F6423] font-serif italic text-sm font-medium tracking-wide block mb-1">
            Why choose MSTbazar?
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif mb-10 text-[#20281D]">
            কেন বাছবেন MSTbazar?
          </h2>

          <div className="space-y-6">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-[60px_1fr] gap-4 sm:gap-6 pt-6 pb-6 border-t border-[#20281D]/10 first:border-t-0"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-[#20281D]/10 flex items-center justify-center text-[#243B2D] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-serif italic text-xs font-medium text-[#8F6423] block mb-1">
                      {item.enSubtitle}
                    </span>
                    <h3 className="text-lg font-bold font-serif text-[#20281D] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#5C6353] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promise Banner */}
      <section className="bg-[#1B2E22] text-[#F7F2E3] py-16 sm:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#DDAE5C] text-xs uppercase font-medium tracking-widest mb-3">
            Our core promise
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-6">
            আমাদের অঙ্গীকার
          </h2>
          <blockquote className="font-serif text-xl sm:text-2xl leading-relaxed text-[#F7F2E3]">
            "নিজেদের পরিবারের জন্য যা নিরাপদ ও পবিত্র মনে করি, ঠিক সেটাই পরম
            আস্থার সাথে তুলে দিই আপনার হাতে।"
          </blockquote>
          <div className="mt-6">
            <svg
              className="w-8 h-8 mx-auto text-[#DDAE5C]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <path d="M12 21V6" />
              <path d="M12 12c0-3.5 2.2-5.5 5.5-6-0.5 3.3-2 5.5-5.5 6Z" />
              <path d="M12 16c0-3.2-2-5-5-5.5 0.4 3 1.8 5 5 5.5Z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="bg-[#EEE4C6] py-16 sm:py-24 px-4 sm:px-6 border-t border-[#20281D]/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#8F6423] font-serif italic text-sm font-medium tracking-wide block mb-1">
              Contact &amp; support
            </span>

            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#20281D]">
              যোগাযোগ করুন
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#5C6353] max-w-2xl mx-auto leading-relaxed">
              MSTbazar সম্পর্কে কোনো প্রশ্ন, পরামর্শ বা সহযোগিতার প্রয়োজন হলে
              আমাদের সাথে যোগাযোগ করুন। আমরা আপনার পাশে আছি।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Website */}
            <a
              href="https://mstbazar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#F7F2E3] border border-[#20281D]/10 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-full bg-[#243B2D] flex items-center justify-center text-[#DDAE5C] mb-4 group-hover:bg-[#1B2E22] transition-colors">
                <FaGlobe className="w-5 h-5" />
              </div>

              <span className="font-serif italic text-xs font-medium text-[#8F6423]">
                Website
              </span>

              <h3 className="text-lg font-bold font-serif text-[#20281D] mt-1">
                আমাদের ওয়েবসাইট
              </h3>

              <p className="text-sm text-[#5C6353] mt-1">mstbazar.com</p>
            </a>

            {/* Facebook */}
            <a
              href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#F7F2E3] border border-[#20281D]/10 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-full bg-[#243B2D] flex items-center justify-center text-[#DDAE5C] mb-4 group-hover:bg-[#1B2E22] transition-colors">
                <FaFacebook className="w-5 h-5" />
              </div>

              <span className="font-serif italic text-xs font-medium text-[#8F6423]">
                Official Page
              </span>

              <h3 className="text-lg font-bold font-serif text-[#20281D] mt-1">
                ফেসবুক পেজ
              </h3>

              <p className="text-sm text-[#5C6353] mt-1">MSTbazar</p>
            </a>

            {/* Hotline */}
            <a
              href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              className="group bg-[#F7F2E3] border border-[#20281D]/10 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-full bg-[#243B2D] flex items-center justify-center text-[#DDAE5C] mb-4 group-hover:bg-[#1B2E22] transition-colors">
                <FaPhoneAlt className="w-5 h-5" />
              </div>

              <span className="font-serif italic text-xs font-medium text-[#8F6423]">
                Hotline
              </span>

              <h3 className="text-lg font-bold font-serif text-[#20281D] mt-1">
                হটলাইন
              </h3>

              <p className="text-sm text-[#5C6353] mt-1">
                {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
              </p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
              className="group bg-[#F7F2E3] border border-[#20281D]/10 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-full bg-[#243B2D] flex items-center justify-center text-[#DDAE5C] mb-4 group-hover:bg-[#1B2E22] transition-colors">
                <FaEnvelope className="w-5 h-5" />
              </div>

              <span className="font-serif italic text-xs font-medium text-[#8F6423]">
                Email
              </span>

              <h3 className="text-lg font-bold font-serif text-[#20281D] mt-1">
                ইমেইল
              </h3>

              <p className="text-sm text-[#5C6353] mt-1 break-all">
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
              </p>
            </a>
          </div>

          {/* Address */}
          <div className="mt-4 bg-[#F7F2E3] border border-[#20281D]/10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="w-11 h-11 rounded-full bg-[#243B2D] flex items-center justify-center text-[#DDAE5C] shrink-0">
              <FaMapMarkerAlt className="w-5 h-5" />
            </div>

            <div>
              <span className="font-serif italic text-xs font-medium text-[#8F6423]">
                Our location
              </span>

              <h3 className="text-lg font-bold font-serif text-[#20281D]">
                আমাদের ঠিকানা
              </h3>

              <p className="text-sm text-[#5C6353]">
                {process.env.NEXT_PUBLIC_CONTACT_ADDRESS}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
