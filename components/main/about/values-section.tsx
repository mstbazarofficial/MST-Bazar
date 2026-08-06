import {
  FlaskConical,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Truck,
  UserCheck,
} from "lucide-react";
import HeadLine from "../common/HeadLine";

const VALUES_DATA = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Pure, raw and unprocessed goodness.",
  },
  {
    icon: FlaskConical,
    title: "No Chemicals",
    description: "No harmful additives, colors or preservatives.",
  },
  {
    icon: UserCheck,
    title: "Trusted Farmers",
    description: "Sourced directly from local trusted farmers.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Tested",
    description: "Every product is lab-tested for your safety.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick & reliable delivery across Bangladesh.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    description: "Your satisfaction is our top most priority.",
  },
];

export function ValuesSection() {
  return (
    <section className=" bg-white">
      <div className="site-container section-y space-y-10">
        {/* 1. Header with Decorative Leaves */}
        <HeadLine title="Our Core Values" />

        {/* 2. Values 6-Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {VALUES_DATA.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-md p-5 flex flex-col items-center text-center space-y-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-primary/60 transition-all duration-300 group "
              >
                {/* Circular Icon Holder */}

                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-primary-dark text-primary-foreground flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 ">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
