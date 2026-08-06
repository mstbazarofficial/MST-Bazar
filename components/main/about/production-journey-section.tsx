import {
  ArrowRight,
  FlaskConical,
  Home,
  PackageCheck,
  ShoppingBag,
  Smile,
  Truck,
} from "lucide-react";
import HeadLine from "../common/HeadLine";

const JOURNEY_STEPS = [
  {
    number: "1",
    title: "Farm",
    desc: "We work with trusted farmers",
    icon: Home,
  },
  {
    number: "2",
    title: "Collection",
    desc: "Carefully collected at the right time",
    icon: ShoppingBag,
  },
  {
    number: "3",
    title: "Quality Check",
    desc: "Lab tested & quality assured",
    icon: FlaskConical,
  },
  {
    number: "4",
    title: "Packaging",
    desc: "Hygienic & eco-friendly packaging",
    icon: PackageCheck,
  },
  {
    number: "5",
    title: "Delivery",
    desc: "Fast delivery to your doorstep",
    icon: Truck,
  },
  {
    number: "6",
    title: "Happy You",
    desc: "Pure & healthy products for you",
    icon: Smile,
  },
];

export function ProductJourneySection() {
  return (
    <section className="space-y-8 site-container section-y">
      {/* Header with Decorative Leaves */}
      <HeadLine title="Our Product Journey" />

      {/* 6 Step Items Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center lg:justify-items-center">
        {JOURNEY_STEPS.map((step, index) => {
          const IconComponent = step.icon;
          const isLast = index === JOURNEY_STEPS.length - 1;

          return (
            <div
              key={index}
              className="relative flex items-center text-left sm:text-center group gap-1"
            >
              <div className="flex items-center gap-1 justify-start">
                {/* Icon Circle */}
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-primary/10 text-primary-dark flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 stroke-[1.8]" />
                </div>

                {/* Connecting Arrow for Desktop */}
                {!isLast && (
                  <ArrowRight className="hidden lg:block w-4 h-4 text-[#0B5D2A]/60 shrink-0" />
                )}
              </div>

              {/* Text Info */}
              <div className="mt-3 space-y-1 text-left w-full">
                <h3 className="text-xs sm:text-sm font-extrabold text-gray-900">
                  {step.number}. {step.title}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium leading-normal">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
