import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  ShieldCheck,
  Lock,
  RotateCcw,
  Headphones,
  LucideIcon,
} from "lucide-react";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your order in 60 mins",
  },
  {
    icon: ShieldCheck,
    title: "Best Quality",
    description: "100% fresh & authentic",
  },
  {
    icon: Lock,
    title: "Secure Payment",
    description: "Multiple secure payment options",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free returns policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here to help you anytime",
  },
];

export default function TrustFeatures() {
  return (
    <section className="w-full section-container">
      <Card className="border border-border/50 shadow-xs bg-card rounded-md overflow-hidden py-0">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border/60 gap-y-4 lg:gap-y-0">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3.5 pt-4 lg:pt-0 first:pt-0 lg:px-4 first:lg:pl-0 last:lg:pr-0"
                >
                  {/* Icon Wrapper with Soft Primary Background */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary stroke-[2.2]" />
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground tracking-tight leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-muted-foreground font-normal leading-tight mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
