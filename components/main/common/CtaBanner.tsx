// components/site/cta-banner.tsx
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const trustPoints = [
  { icon: Leaf, label: "100% organic" },
  { icon: ShieldCheck, label: "Lab tested" },
  { icon: Truck, label: "Fast delivery" },
];

export function CtaBanner() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#0f3d1f]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/cta-bg.webp"
          alt="CTA Banner Background"
          fill
          priority
          className="object-cover object-right"
        />
      </div>

      {/* 85% solid overlay on mobile | Pure transparent gradient on large screens */}
      <div className="absolute inset-0 bg-[#0f3d1f]/85 lg:bg-[#0f3d1f]/0" />

      <div className="site-container relative z-10 py-14 sm:py-16 lg:py-10">
        <div className="max-w-xl">
          <span className="inline-flex items-center rounded-full border border-[#FFC700]/30 bg-[#FFC700]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#FFC700]">
            Straight from the farm
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-4xl">
            Join thousands of
            <br />
            happy families
          </h2>

          <p className="mt-3 max-w-sm text-sm text-emerald-100/90 sm:text-base">
            Pure honey, oils, and pantry staples — sourced honestly, tested
            rigorously, delivered to your door.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-md bg-[#FFC700] px-6 py-3 text-sm font-bold text-[#0f3d1f] shadow-sm transition-all hover:bg-[#FFD633] hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f3d1f]"
            >
              Shop now
              <ArrowRight className="size-4 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
            </Link>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {trustPoints.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-100/90"
                >
                  <Icon className="size-3.5 text-[#FFC700]" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
