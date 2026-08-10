import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Headset,
  HeartHandshake,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import HeadingStyle2 from "../common/HeadingStyle2";

export function ContactHero() {
  const features = [
    { icon: Clock, title: "Quick Response", desc: "Within 24 Hours" },
    { icon: UserCheck, title: "Trusted Support", desc: "100% Friendly" },
    { icon: ShieldCheck, title: "Secure & Safe", desc: "Your privacy matters" },
    { icon: HeartHandshake, title: "Satisfaction", desc: "We care for you" },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16 bg-linear-to-r from-primary/5 to-transparent p-6 md:p-10 rounded-md">
      {/* Left Content */}
      <div className="flex-1 space-y-6">
        <Badge className="bg-primary/10 text-primary-dark hover:bg-primary/20 border-none px-4 py-1.5 rounded-full shadow-none font-semibold flex items-center gap-2 w-fit">
          WE'RE HERE TO HELP <Headset className="w-4 h-4" />
        </Badge>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          How Can We <br />{" "}
          <HeadingStyle2
            secondTitle="Assist You"
            isUnderLine={false}
            className="inline-block mr-3"
            size="xl"
          />
          Today?
        </h1>

        <p className="text-gray-600 text-lg max-w-md leading-relaxed">
          Have a question or need assistance? <br />
          Our friendly team is always ready to support you.
        </p>

        {/* Feature Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-green-100">
                <feature.icon className="w-6 h-6 text-primary-dark" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-sm font-bold text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content / Image (Placeholder using standard img tag) */}
      <div className="flex-1 flex justify-center lg:justify-end w-full relative">
        <div className="relative w-full max-w-lg aspect-4/3 rounded-2xl overflow-hidden flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1605902711622-cfb43c443f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            alt="Promo Products"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            quality={75}
            className="w-full h-full object-cover rounded-2xl mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  );
}
