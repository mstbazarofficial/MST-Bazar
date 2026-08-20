import {
  FlaskConical,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Truck,
  UserCheck,
} from "lucide-react";
import { SectionHeading } from "../common/layout/section-heading";

const VALUES_DATA = [
  {
    icon: Leaf,
    title: "100% Pure & Organic",
    description:
      "Ethically harvested raw ingredients packed with uncompromised natural goodness.",
  },
  {
    icon: FlaskConical,
    title: "Zero Chemicals & Additives",
    description:
      "Strictly free from artificial preservatives, synthetic colors, or harmful chemicals.",
  },
  {
    icon: UserCheck,
    title: "Direct From Local Farmers",
    description:
      "Empowering trusted local growers and beekeepers through direct, fair sourcing.",
  },
  {
    icon: ShieldCheck,
    title: "Rigorously Lab Tested",
    description:
      "Every single batch undergoes stringent quality control tests for absolute safety.",
  },
  {
    icon: Truck,
    title: "Nationwide Express Delivery",
    description:
      "Fast, reliable doorstep delivery with tracking across all 64 districts.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Satisfaction First",
    description:
      "Instant inspection upon delivery with hassle-free replacement guarantees.",
  },
];

export function ValuesSection() {
  return (
    <section className="bg-muted">
      <div className="site-container section-y space-y-10">
        {/* Section Heading */}
        <SectionHeading title="Our Core Values" highlightPositions={[2]} />

        {/* 2-Row Layout: 3 Columns on Desktop, 2 on Tablet, 1 on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {VALUES_DATA.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card p-6 pb-8 border border-emerald-100/60 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  {/* Top Icon Pill */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6 stroke-[1.8]" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Solid Colored Bottom Accent Line (Matching Image) */}
                <div className="absolute inset-x-0 bottom-0 h-1 w-full bg-linear-to-r from-[#10B981] via-[#059669] to-[#047857] transition-all duration-300 " />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
