import { ArrowRight, ChevronRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#F2F8F4] via-[#F7FAF8] to-white py-6 sm:py-8 lg:py-10">
      {/* Background Banner Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src="/assets/about-hero-banner.png"
          alt="MST Bazar Natural Products"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/10 sm:bg-transparent" />
      </div>

      <div className="site-container relative z-10">
        {/* 1. Compact Breadcrumb */}
        <nav className="inline-flex items-center gap-2 text-xs text-gray-600 font-medium mb-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200/60 shadow-2xs">
          <Link href="/" className="hover:text-[#0B5D2A] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold">About Us</span>
        </nav>

        {/* 2. Compact Content Card */}
        <div className="max-w-xl lg:max-w-xl">
          <div className="bg-white/90 sm:bg-white/85 backdrop-blur-md p-5 sm:p-6 lg:p-7 rounded-2xl border border-white/60 shadow-lg space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight text-left">
              MST Bazar: Trusted Natural Quality Products <br />
              <span className="text-[#0B5D2A]">Delivered All Bangladesh</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-700 font-normal leading-relaxed text-left">
              At MST Bazar, we believe that healthy living starts with pure,
              natural, and authentic products. Our mission is to bring
              farm-fresh goodness to your doorstep with trust and care.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-primary-dark hover:bg-[#084820] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 sm:py-3 rounded-lg transition-all shadow-xs active:scale-95 w-full sm:w-auto"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50/50 border border-[#0B5D2A] text-primary-dark text-xs sm:text-sm font-semibold px-5 py-2.5 sm:py-3 rounded-lg transition-all active:scale-95 w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 text-primary-dark" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
