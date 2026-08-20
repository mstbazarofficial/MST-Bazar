import {
  Award,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "../common/layout/section-heading";

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Pure & Lab Tested",
    description:
      "Zero added sugars, syrups, or preservatives. Quality tested every batch.",
  },
  {
    icon: Leaf,
    title: "Direct From Local Farms",
    description:
      "Sourced directly from authentic local farmers and beekeepers across Bangladesh.",
  },
  {
    icon: Truck,
    title: "Fresh Doorstep Delivery",
    description:
      "Hygienically packaged in eco-friendly glass containers to seal in natural goodness.",
  },
  {
    icon: Award,
    title: "Money-Back Guarantee",
    description:
      "Hassle-free doorstep inspection. If you're not satisfied, you don't pay.",
  },
];

export function HomeTrustSection() {
  return (
    <section className=" py-12 lg:py-16">
      <div className="site-container space-y-10">
        {/* Section Heading */}
        <SectionHeading title="Why Choose Us" highlightPositions={[2, 3]} />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Feature Cards Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {TRUST_PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 border-b-4 border-b-emerald-500 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Right Decorative Rounded Blob */}
                  <div className="absolute -top-8 -right-8 size-28 rounded-full bg-emerald-100/50 group-hover:bg-emerald-200/70 transition-colors duration-300 pointer-events-none" />

                  {/* Card Content */}
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center">
                      <div className="size-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Icon className="w-5 h-5 stroke-2" />
                      </div>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-emerald-800 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Featured Image */}
          <div className="lg:col-span-5 relative flex flex-col min-h-90 lg:min-h-0">
            <div className="relative w-full h-full min-h-90 lg:min-h-full rounded-3xl overflow-hidden shadow-lg border border-emerald-100">
              <Image
                src="/assets/honey-pot.png"
                alt="100% Pure Organic Products"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Floating Badge 1: Top Rated Choice */}
            <div className="absolute -bottom-3 left-4 sm:left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
              <div className="size-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900">
                  Top Rated Quality
                </p>
                <p className="text-[10px] text-gray-500 font-medium">
                  Customer Verified Choice
                </p>
              </div>
            </div>

            {/* Floating Badge 2: Organic Certified */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-950">
                100% Organic Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
