import { Headset, Lock, Shield, Undo2 } from "lucide-react";
type Feature = {
  icon: React.ElementType;
  title: string;
  sub: string;
};

export function FeatureBanner() {
  const features: Feature[] = [
    {
      icon: Shield,
      title: "100% Genuine Products",
      sub: "Authentic & Quality Assured",
    },
    { icon: Undo2, title: "Easy Returns", sub: "7 Days Easy Return" },
    { icon: Lock, title: "Secure Payment", sub: "100% Secure Payment" },
    { icon: Headset, title: "Customer Support", sub: "We're Here to Help" },
  ];

  return (
    <div className="mt-20 bg-primary-dark rounded-md p-8 lg:p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <item.icon
              className="w-8 h-8 text-white shrink-0"
              strokeWidth={1.5}
            />
            <div>
              <h4 className="text-white font-bold text-sm mb-0.5">
                {item.title}
              </h4>
              <p className="text-green-100/70 text-xs">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
