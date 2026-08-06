import React from "react";
import { Boxes, Tag, Users, Truck, ShieldCheck } from "lucide-react";

interface Feature {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    id: 1,
    icon: Boxes,
    title: "Wide Range",
    description: "10,000+ products under one roof",
  },
  {
    id: 2,
    icon: Tag,
    title: "Affordable Prices",
    description: "Best prices in the market",
  },
  {
    id: 3,
    icon: Users,
    title: "Trusted by 10L+",
    description: "happy customers across Bangladesh",
  },
  {
    id: 4,
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick delivery at your doorstep",
  },
  {
    id: 5,
    icon: ShieldCheck,
    title: "Safe & Secure",
    description: "100% secure payments",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="section-container">
      {/* Outer Card Container */}
      <div className="bg-muted/25 dark:bg-card/50 border border-border/60 rounded-md p-6 sm:p-8 lg:py-10 lg:px-6 shadow-2xs">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-center text-foreground tracking-tight mb-8 sm:mb-10">
          Why Choose{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent font-extrabold">
            MST
          </span>{" "}
          Bazar?
        </h2>

        {/* Features List / Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-0 lg:divide-x lg:divide-border/60">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className={`flex flex-col items-center text-center px-2 sm:px-4 ${
                  index === 4 ? "col-span-2 md:col-span-1 lg:col-span-1" : ""
                }`}
              >
                {/* Icon Badge */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 sm:mb-4 shrink-0 transition-transform hover:scale-110 duration-200">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-2" />
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1 leading-snug">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-muted-foreground font-medium max-w-42.5 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
