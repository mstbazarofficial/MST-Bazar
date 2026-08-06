import {
  Heart,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  UserCheck,
} from "lucide-react";

const STATS = [
  {
    icon: UserCheck,
    value: "20K+",
    label: "Happy Customers",
  },
  {
    icon: ShoppingBag,
    value: "500+",
    label: "Daily Orders",
  },
  {
    icon: ShieldCheck,
    value: "50+",
    label: "Premium Products",
  },
  {
    icon: MapPin,
    value: "64",
    label: "Districts Delivery",
  },
  {
    icon: Heart,
    value: "98%",
    label: "Customer Satisfaction",
  },
];

export function StatsBar() {
  return (
    <section className=" text-primary-foreground site-container section-y shadow-md">
      <div className="bg-primary-dark grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 p-6 rounded-md">
        {STATS.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-3 justify-start sm:justify-center ${
                index !== 0 ? "pt-4 sm:pt-0" : ""
              }`}
            >
              {/* Gold Accent Circle Outline Icon */}
              <div
                className="w-10 h-10 rounded-full border-2
               border-[#afd102] flex items-center justify-center shrink-0 "
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </div>

              {/* Value & Label */}
              <div>
                <p className="text-lg sm:text-xl font-black tracking-tight text-white leading-none">
                  {stat.value}
                </p>
                <p className="text-[11px] text-emerald-100 font-medium mt-1 leading-tight">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
