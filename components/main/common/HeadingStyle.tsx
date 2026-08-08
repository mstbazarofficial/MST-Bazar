import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function HeadingStyle({
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {/* Small Heading */}
      <p className="mb-2 text-xl font-semibold uppercase tracking-[0.18em] text-zinc-800">
        SHOP BY
      </p>

      {/* Main Heading */}
      <h2
        className="
        relative
        inline-block
        text-5xl
        md:text-6xl
        lg:text-7xl
        font-black
        leading-none
        tracking-tight
        bg-linear-to-b
        from-[#6FD43A]
        via-[#1F8F2E]
        to-[#084F1F]
        bg-clip-text
        text-transparent
      "
      >
        {title}

        {/* Leaf */}
        <span className="absolute -top-2 right-0 text-3xl">🌿</span>
      </h2>

      {/* Yellow Brush */}
      <div
        className="
        mt-4
        h-1.5
        w-72
        rounded-full
        bg-linear-to-r
        from-[#FFD84A]
        via-[#FFC300]
        to-[#F4B000]
      "
      />

      {subtitle && (
        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}
