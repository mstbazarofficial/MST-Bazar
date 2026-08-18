import Image from "next/image";

export default function PromoBannersSection() {
  return (
    <section className="w-full site-container section-y">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Banner 1: Flat 20% OFF (Mint Green Theme) */}
        <div className="relative overflow-hidden rounded-md bg-[#FDF6E2] dark:bg-amber-950/30 p-5 sm:p-6 sm:pr-2 flex items-center justify-between min-h-40 sm:min-h-45 border border-amber-100/60 dark:border-amber-900/40 shadow-xs hover:shadow-md transition-all duration-300 group">
          {/* Left Text Content */}
          <div className="z-10 max-w-[58%] space-y-1.5 sm:space-y-2">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#15803d] leading-tight tracking-tight">
              Flat 20% OFF
            </h3>
            <p className="text-sm sm:text-base font-bold text-foreground">
              On First Order
            </p>

            {/* Promo Code Pill Badge */}
            <div className="pt-1 sm:pt-2">
              <div className="inline-flex items-center gap-1.5 bg-card/90 dark:bg-card backdrop-blur-xs px-3 py-1.5 rounded-full border border-border/60 text-xs font-medium text-muted-foreground shadow-2xs">
                <span>Use Code:</span>
                <span className="font-extrabold text-foreground tracking-wide">
                  MST20
                </span>
              </div>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="absolute right-0 bottom-0 top-0 w-[45%] sm:w-[48%] flex items-center justify-end p-2 pointer-events-none">
            <Image
              fill
              sizes="(max-width: 768px) 45vw, (max-width: 1200px) 48vw, 48vw"
              src="/assets/banner.png"
              alt="Flat 20% Off Offer"
              loading="eager"
              className="w-full h-full object-contain object-bottom-right group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Banner 2: Free Delivery (Cream Yellow Theme) */}
        <div className="relative overflow-hidden rounded-md bg-[#EAF6EB] dark:bg-emerald-950/40 p-5 sm:p-6 sm:pr-2 flex items-center justify-between min-h-40 sm:min-h-45 border border-emerald-100/60 dark:border-emerald-900/40 shadow-xs hover:shadow-md transition-all duration-300 group">
          {/* Left Text Content */}
          <div className="z-10 max-w-[58%] space-y-1.5 sm:space-y-2">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#15803d] leading-tight tracking-tight">
              Free Delivery
            </h3>
            <p className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground leading-snug">
              On Orders Above{" "}
              <span className="font-extrabold text-foreground">৳999</span>
            </p>
          </div>

          {/* Right Image Container */}
          <div className="absolute right-0 bottom-0 top-0 w-[45%] sm:w-[48%] flex items-center justify-end p-2 pointer-events-none pr-2">
            <Image
              src="/assets/delivery.png"
              alt="Free Delivery Rider"
              className="object-cover  group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
              fill
              sizes="(max-width: 768px) 45vw, (max-width: 1200px) 48vw, 48vw"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
