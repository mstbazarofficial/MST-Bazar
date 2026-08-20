import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "../common/layout/section-heading";

const TRUST_POINTS = [
  "Carefully sourced from trusted local farms and authentic beekeepers.",
  "Farm-to-home delivery model to retain maximum natural goodness.",
  "100% free from added sugars, syrups, and artificial preservatives.",
  "Lab tested and quality assured for every batch before packaging.",
  "Hygienically processed and vacuum-sealed for optimal freshness.",
  "Eco-friendly, food-grade glass packaging to prevent contamination.",
  "Transparent origin tracking so you know where your food comes from.",
  "100% money-back guarantee with hassle-free doorstep inspection.",
];

export function WhyTrustSection() {
  return (
    <section className="bg-[#F8FAF6] border-y border-gray-100/80">
      <div className="site-container section-y space-y-8">
        {/* Top: Full-Width Section Heading */}
        <SectionHeading title="Why Customers Trust MST Bazar" />

        {/* Bottom: Main Content Grid (Items on Left, Image on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: 8 Trust Points in 2 Columns */}
          <div className="lg:col-span-7">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {TRUST_POINTS.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 hover:text-primary transition-colors cursor-default font-medium leading-relaxed bg-white/70 p-3 rounded-xl border border-gray-100/80 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5 fill-[#EAF5ED]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Featured Image */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-95 w-full rounded-2xl overflow-hidden shadow-xs border border-emerald-100/50">
            <Image
              src="/assets/honey-pot.png"
              alt="Pure Honey and Natural Ingredients"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
