import Link from "next/link";
import { UnderLine } from "./Svg";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeadingStyle2({
  className,
  firstTitle,
  secondTitle,
  size = "md",
  link,
  position,
  isUnderLine = true,
  titleAlignX = "between",
  linkTitle = "View All",
}: {
  className?: string;
  firstTitle?: string;
  secondTitle: string;
  size?: "sm" | "md" | "lg" | "xl";
  link?: string;
  position?: number;
  isUnderLine?: boolean;
  titleAlignX?: "left" | "center" | "right" | "between";
  linkTitle?: string;
}) {
  return (
    <div
      className={cn(
        "flex justify-between mb-8 sm:items-end items-center gap-5 sm:flex-row flex-col",
        isUnderLine && "pb-6",
        titleAlignX === "left" && "justify-start",
        titleAlignX === "center" && "justify-center",
        titleAlignX === "right" && "justify-end",
        titleAlignX === "between" && "justify-between",
        isUnderLine && "border-b   relative border-gray-400/50",
        className,
      )}
    >
      <div className={cn("flex")}>
        {firstTitle && (
          <div className="flex items-center">
            <h2
              className={cn(
                " mr-2 uppercase font-bold tracking-tight text-foreground",
                size === "sm" && "text-2xl",
                size === "md" && "md:text-3xl text-2xl",
                size === "lg" && "xl:text-4xl md:text-3xl text-2xl",
                size === "xl" && "text-5xl",
              )}
            >
              {firstTitle}
            </h2>
          </div>
        )}

        <div>
          <h2
            className={cn(
              "category-title text-center inline-block relative",
              size === "sm" && "text-3xl",
              size === "md" && "md:text-4xl text-3xl",
              size === "lg" && "xl:text-5xl md:text-4xl text-3xl",
              size === "xl" && "text-6xl",
            )}
          >
            {secondTitle}
            <UnderLine position={position} />
          </h2>
        </div>
      </div>
      {link && (
        <div>
          <Link
            href={link}
            className="text-xs flex justify-between items-center gap-1.5 sm:text-sm font-semibold text-primary hover:underline transition-all"
          >
            <span>{linkTitle}</span>
            <ArrowRight className="inline-block ml-1 h-4 w-4 " />
          </Link>
        </div>
      )}
      {isUnderLine && (
        <div className="absolute -bottom-0.5 w-16 h-1 bg-primary bg-green-gradient"></div>
      )}
    </div>
  );
}
