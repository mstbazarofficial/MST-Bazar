import {
  ArrowRight,
  FlaskConical,
  Home,
  PackageCheck,
  ShoppingBag,
  Smile,
  Truck,
} from "lucide-react";
import { SectionHeading } from "../common/layout/section-heading";

const JOURNEY_STEPS = [
  {
    number: "01",
    title: "Farm Sourcing",
    desc: "Directly sourced from trusted organic farmers & beekeepers.",
    icon: Home,
  },
  {
    number: "02",
    title: "Collection",
    desc: "Carefully gathered at peak freshness and quality.",
    icon: ShoppingBag,
  },
  {
    number: "03",
    title: "Quality Check",
    desc: "Lab tested for purity with zero chemical additives.",
    icon: FlaskConical,
  },
  {
    number: "04",
    title: "Packaging",
    desc: "Hygienically packed in eco-friendly containers.",
    icon: PackageCheck,
  },
  {
    number: "05",
    title: "Fast Delivery",
    desc: "Swift, safe doorstep delivery across Bangladesh.",
    icon: Truck,
  },
  {
    number: "06",
    title: "Happy Customer",
    desc: "Pure & healthy products delivered to your home.",
    icon: Smile,
  },
];

export function ProductJourneySection() {
  return (
    <section className="site-container section-y space-y-10">
      {/* Section Header */}
      <SectionHeading title="Our Product Journey" highlightPositions={[2]} />

      {/* Grid Container */}
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-3">
        {JOURNEY_STEPS.map((step, index) => {
          const IconComponent = step.icon;
          const isLast = index === JOURNEY_STEPS.length - 1;

          return (
            <div
              key={step.number}
              className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card p-5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
            >
              {/* Connector Arrow for Desktop */}
              {!isLast && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-xs transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                </div>
              )}

              {/* Card Top: Step Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <IconComponent className="h-6 w-6 stroke-[1.75]" />
                </div>
                <span className="text-xs font-bold tracking-wider text-muted-foreground/60 transition-colors group-hover:text-primary">
                  {step.number}
                </span>
              </div>

              {/* Card Bottom: Content */}
              <div className="mt-5 space-y-1.5">
                <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                  {step.title}
                </h3>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground">
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
