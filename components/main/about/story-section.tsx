import { cn } from "@/lib/utils";
import { Lightbulb, ShieldCheck, Store, TrendingUp, Users } from "lucide-react";
import HeadLine from "../common/HeadLine";

const STORY_STEPS = [
  {
    icon: Lightbulb,
    title: "Dream",
    description:
      "It all started with a simple dream to bring pure & healthy food to every home.",
    year: "2018",
  },
  {
    icon: Store,
    title: "Started Small",
    description:
      "We started small with few items and a lot of passion for quality.",
    year: "2019",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Brand",
    description:
      "Your trust inspired us to grow and maintain highest standards.",
    year: "2020",
  },
  {
    icon: Users,
    title: "Thousands of Happy Customers",
    description: "Now thousands of families rely on MST Bazar every day.",
    year: "2022",
  },
  {
    icon: TrendingUp,
    title: "Growing Every Day",
    description:
      "We are committed to serving more families with even better quality.",
    year: "Today & Beyond",
  },
];

export function StoryTimeline() {
  return (
    <section className="bg-white">
      <div className="site-container section-y space-y-10">
        {/* 1. Header with Decorative Leaves */}
        <HeadLine title="Our Story Timeline" />

        {/* 2. Timeline Grid */}
        <div className="relative">
          {/* Dashed Connecting Line (Desktop Only) */}
          <div
            className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-[#8DC63F]/70 z-0"
            aria-hidden="true"
          />

          {/* 5 Timeline Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-3 relative z-10">
            {STORY_STEPS.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center text-center space-y-2.5 group",
                    index === 4 && "max-lg:col-span-full",
                  )}
                >
                  {/* Circular Icon */}
                  <div className="w-14 h-14 rounded-full bg-[#0B5D2A] text-white flex items-center justify-center shadow-md border-4 border-white shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 stroke-2" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 leading-snug min-h-8 flex items-center justify-center">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed max-w-52.5 sm:max-w-47.5">
                    {step.description}
                  </p>

                  {/* Year Tag */}
                  <span className="text-xs font-extrabold text-[#0B5D2A] pt-1">
                    {step.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
