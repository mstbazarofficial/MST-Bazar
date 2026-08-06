import { FlaskConical, Leaf, ShieldCheck } from "lucide-react";
import HeadLine from "../common/HeadLine";

const CERTIFICATES = [
  {
    icon: FlaskConical,
    title: "Lab Tested",
    description: "All products are lab tested for safety & purity.",
  },
  {
    icon: Leaf,
    title: "Pure Quality",
    description: "100% pure & authentic guaranteed.",
  },
  {
    icon: ShieldCheck,
    title: "Food Safety",
    description: "Follow food safety standards for your well-being.",
  },
];

export function CertificatesSection() {
  return (
    <div className="space-y-6 site-container section-y">
      {/* Section Header */}
      <HeadLine title="Our Certificates & Quality Assurance" />

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {CERTIFICATES.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-primary/10 border border-stone-200/60 rounded-md p-4 sm:p-5 flex items-center gap-4 shadow-xs hover:border-primary/60 transition-all duration-300"
            >
              {/* Icon Holder */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#E2ECE5] text-primary flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 stroke-[1.8]" />
              </div>

              {/* Content */}
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
