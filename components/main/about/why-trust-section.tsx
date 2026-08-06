import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import HeadLine from "../common/HeadLine";

const TRUST_POINTS = [
  "Carefully sourced from trusted farms and beekeepers.",
  "Farm to Home delivery to retain natural goodness.",
  "Lab tested and quality assured for every batch.",
  "Hygienically packed to ensure maximum freshness.",
  "100% money back guarantee for your peace of mind.",
];

export function WhyTrustSection() {
  return (
    <section className="bg-[#F8FAF6] border border-gray-100 rounded-2xl ">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center site-container section-y">
        {/* 1. Left Honey Image */}
        <div className="md:col-span-full lg:col-span-5 relative h-55 sm:h-65 lg:h-70 w-full rounded-2xl overflow-hidden shadow-xs">
          <Image
            src="/assets/honey-pot.png"
            alt="Pure Honey and Chamomile Flowers"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover lg:object-center object-top"
          />
        </div>

        {/* 2. Middle Checklist Content */}
        <div className="md:col-span-8 lg:col-span-5 space-y-4">
          <HeadLine title="Why Customers Trust MST Bazar" position="left" />

          <ul className="space-y-2.5">
            {TRUST_POINTS.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 hover:text-primary cursor-pointer font-medium leading-snug"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5 fill-[#EAF5ED]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Right Quality Assured Badge (SVG Stamp) */}
        <div className="md:col-span-4 lg:col-span-2 flex justify-center items-center pt-4 md:pt-0">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full text-[#0B5D2A]">
              {/* Outer double border */}
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <circle
                cx="100"
                cy="100"
                r="86"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              {/* Curved Text Path */}
              <path
                id="textPathTop"
                d="M 30,100 A 70,70 0 1,1 170,100"
                fill="none"
              />
              <path
                id="textPathBottom"
                d="M 170,100 A 70,70 0 0,1 30,100"
                fill="none"
              />

              <text
                fontSize="17"
                fontWeight="bold"
                letterSpacing="4"
                fill="currentColor"
              >
                <textPath
                  href="#textPathTop"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  QUALITY
                </textPath>
              </text>

              <text
                fontSize="17"
                fontWeight="bold"
                letterSpacing="3"
                fill="currentColor"
              >
                <textPath
                  href="#textPathBottom"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  ASSURED
                </textPath>
              </text>

              {/* Side Stars */}
              <polygon
                points="25,100 28,93 35,93 30,98 32,105 25,101 18,105 20,98 15,93 22,93"
                fill="currentColor"
              />
              <polygon
                points="175,100 178,93 185,93 180,98 182,105 175,101 168,105 170,98 165,93 172,93"
                fill="currentColor"
              />

              {/* Center Leaves */}
              <g transform="translate(68, 62) scale(2.8)">
                <path
                  d="M17,8C8,10 5,16 3,21C8,20 15,18 19,13C20,11.5 21,9 21,7C21,4.5 19.5,3.5 18,3.5C15.5,3.5 13,6 12,8C11,10 11,12 11,12C11,12 13,10.5 15,10C17,9.5 17,8 17,8Z"
                  fill="#0B5D2A"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
