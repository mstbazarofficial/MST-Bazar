import Image from "next/image";
import HeadLine from "../common/HeadLine";

export function FounderSection() {
  return (
    <section className="bg-white">
      <div className="site-container section-y">
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center ">
          {/* 1. Left Side: Founder Image with Signature Card */}
          <div className=" max-sm:space-y-3 lg:flex-[0.5] flex-1 relative">
            <div className="relative xl:aspect-video lg:aspect-square aspect-video w-full rounded-md overflow-hidden shadow-xs border border-gray-100 md:h-98 lg:h-96">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                alt="Md. Saifur Rahman - Founder & CEO"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                className="object-cover object-center"
              />
            </div>
            {/* Bottom Right Floating Badge Card */}
            <div className="md:absolute block w-full bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-sm p-4 sm:p-5 shadow-lg border border-gray-100 md:max-w-67.5">
              <span className="text-[11px] font-extrabold text-[#0B5D2A] tracking-wide block mb-1">
                Founder & CEO
              </span>

              {/* Signature Text Style */}
              <h3 className="text-xl sm:text-2xl font-serif italic text-gray-800 tracking-wide font-bold">
                Md. Saifur Rahman
              </h3>

              <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed mt-2 pt-2 border-t border-gray-100">
                &ldquo;Our goal is simple – to help you live a healthier life
                with natural goodness.&rdquo;
              </p>
            </div>
          </div>

          {/* 2. Right Side: Text & Mission/Vision Cards */}
          <div className="space-y-6 lg:flex-[0.5] flex-1">
            {/* Heading & Paragraphs */}
            <div className="space-y-6">
              <HeadLine
                title="Meet Our Founder"
                position="left"
                className="text-3xl"
              />

              <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed">
                MST Bazar was born out of a simple belief – our families deserve
                the purest and the best. I traveled across villages and farms of
                Bangladesh to handpick natural products so that you can live a
                healthier life with peace of mind.
              </p>

              <p className="text-xs sm:text-sm text-gray-800 font-semibold pt-1">
                Thank you for being a part of our journey.
              </p>
            </div>

            {/* Mission & Vision Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Card 1: Our Mission */}
              <div className="bg-[#F8FAF6] border border-[#E5EFE8] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                    Our Mission
                  </h4>
                  <p className="text-[11px] text-gray-600 font-medium leading-normal mt-1">
                    To provide 100% natural and authentic products that ensure a
                    healthy lifestyle for every family.
                  </p>
                </div>
              </div>

              {/* Card 2: Our Vision */}
              <div className="bg-[#F8FAF6] border border-[#E5EFE8] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                    Our Vision
                  </h4>
                  <p className="text-[11px] text-gray-600 font-medium leading-normal mt-1">
                    To be Bangladesh&apos;s most trusted and loved natural
                    grocery brand.
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
