import {
  ArrowRight,
  ChevronRight,
  FlaskConical,
  Leaf,
  Sprout,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#F2F8F4] via-[#F7FAF8] to-white pt-6 pb-16 lg:py-16">
      <div className="absolute w-full inset-0  overflow-hidden shadow-xs">
        <Image
          src="/assets/about-hero-banner.png"
          alt="MST Bazar Natural Products & Founder"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
          className="object-cover object-center"
          priority
        />
      </div>
      <div className="site-container relative  z-10">
        {/* 1. Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-8">
          <Link href="/" className="hover:text-[#0B5D2A] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-700 font-semibold">About Us</span>
        </nav>

        {/* 2. Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 lg:gap-12 items-center ">
          {/* Left Column: Heading, Subtitle & Buttons */}
          <div className="col-span-6 text-left relative xl:p-5">
            <div className="absolute inset-0 bottom-0 mb-0 bg-white opacity-90 z-[-1] blur-3xl" />
            <h1 className="text-3xl mb-6 sm:text-4xl lg:text-[52px] font-extrabold text-[#111827] leading-[1.15] tracking-tight">
              Bringing Nature’s Best <br />
              to <span className="text-[#0B5D2A]">Every Bangladeshi Home</span>
            </h1>

            <p className="text-sm mb-6 sm:text-base text-gray-600 max-w-xl font-normal leading-relaxed">
              At MST Bazar, we believe that healthy living starts with pure,
              natural and authentic products. Our mission is to bring farm-fresh
              goodness to your doorstep with trust and care.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 bg-[#0B5D2A] hover:bg-[#084820] text-white text-sm font-semibold px-6 py-3.5 rounded-lg transition-all shadow-sm active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="#our-story"
                className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50/50 border border-[#0B5D2A] text-[#0B5D2A] text-sm font-semibold px-6 py-3.5 rounded-lg transition-all active:scale-95"
              >
                <Sprout className="w-4 h-4 text-[#0B5D2A]" />
                <span>Our Story</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image & Overlay Card */}
          <div className="col-span-6 relative flex justify-center lg:justify-end">
            {/* Background Image Container */}

            {/* Floating Right Card (Badges Box) */}
            <div className="absolute right-2 sm:right-4 lg:top-1/2  lg:-translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-gray-100  flex-col gap-5 min-w-50 sm:min-w-55 hidden sm:flex">
              {/* Item 1: 100% Natural */}
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#EAF5ED] flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-[#0B5D2A]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-snug">
                    100% Natural
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    No Additives
                  </p>
                </div>
              </div>

              {/* Item 2: Lab Tested */}
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#EAF5ED] flex items-center justify-center shrink-0">
                  <FlaskConical className="w-5 h-5 text-[#0B5D2A]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-snug">
                    Lab Tested
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Quality Assured
                  </p>
                </div>
              </div>

              {/* Item 3: Trusted by */}
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#EAF5ED] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#0B5D2A]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-snug">
                    Trusted by
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    20K+ Families
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
