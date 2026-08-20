import { Lightbulb, ShieldCheck, Store, TrendingUp, Users } from "lucide-react";
import { SectionHeading } from "../common/layout/section-heading";

const STORY_STEPS = [
  {
    icon: Lightbulb,
    title: "A Humble Dream",
    description:
      "It all started with a clear vision: bringing pure, unadulterated organic food straight to everyday households.",
    year: "2018",
  },
  {
    icon: Store,
    title: "Starting Small",
    description:
      "Launched with a handful of artisanal products and an unyielding commitment to uncompromised quality.",
    year: "2019",
  },
  {
    icon: ShieldCheck,
    title: "Building Trust",
    description:
      "Word of mouth spread quickly. Your trust inspired us to establish rigorous laboratory purity standards.",
    year: "2020",
  },
  {
    icon: Users,
    title: "Thousands Served",
    description:
      "Expanded nationwide, becoming a staple household name for thousands of health-conscious families.",
    year: "2022",
  },
  {
    icon: TrendingUp,
    title: "Today & Beyond",
    description:
      "Continuously innovating with sustainable sourcing, eco-friendly packaging, and expanding choices.",
    year: "Present",
  },
];

export function StoryTimeline() {
  return (
    <section className="bg-background">
      <div className="site-container section-y space-y-12">
        {/* Section Heading */}
        <SectionHeading title="Our Story Timeline" highlightPositions={[2]} />

        <div className="relative">
          {/* Desktop Horizontal Progress Line */}
          <div
            className="hidden lg:block absolute top-7 left-[8%] right-[8%] h-0.5 border-t-2 border-dashed border-primary/40 z-0"
            aria-hidden="true"
          />

          {/* Mobile/Tablet Vertical Progress Line */}
          <div
            className="block lg:hidden absolute top-4 bottom-4 left-6 w-0.5 border-l-2 border-dashed border-primary/40 z-0"
            aria-hidden="true"
          />

          {/* Timeline Nodes */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-3 relative z-10">
            {STORY_STEPS.map((step, index) => {
              const IconComponent = step.icon;

              return (
                <div
                  key={index}
                  className="relative flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center gap-5 lg:gap-4 group pl-14 lg:pl-0"
                >
                  {/* Circular Icon & Year Tag Container */}
                  <div className="absolute left-0 lg:relative flex flex-col items-center shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm ring-4 ring-background transition-transform duration-300 group-hover:scale-110 group-hover:ring-primary/20">
                      <IconComponent className="h-5 w-5 stroke-[1.8]" />
                    </div>
                  </div>

                  {/* Step Card Content */}
                  <div className="flex-1 flex flex-col justify-between rounded-xl border border-border/60 bg-card p-5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md w-full">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between lg:justify-center gap-2">
                        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                          {step.year}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {step.title}
                      </h3>
                      <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
