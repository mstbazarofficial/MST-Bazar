import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface SectionHeadingProps {
  title: string;
  highlightPositions?: number[]; // e.g. [1, 2] groups words 1 and 2 in one span
  showBorder?: boolean;
  rightElement?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  highlightPositions,
  showBorder = true,
  rightElement,
  className = "",
}: SectionHeadingProps) {
  const words = title.trim().split(/\s+/);
  const targetPositions = highlightPositions ?? [words.length];

  // Group consecutive words with the same highlight state into a single group
  const groups: { text: string; isHighlighted: boolean }[] = [];

  words.forEach((word, index) => {
    const isHighlighted = targetPositions.includes(index + 1);
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.isHighlighted === isHighlighted) {
      lastGroup.text += ` ${word}`;
    } else {
      groups.push({ text: word, isHighlighted });
    }
  });

  return (
    <div
      className={cn(
        "relative flex items-end justify-between gap-4 w-full pb-2 md:pb-3 mb-6",
        showBorder && "border-b border-gray-300/60",
        className,
      )}
    >
      {/* Title */}
      <h2 className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-tight whitespace-nowrap text-foreground">
        {groups.map((group, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && " "}
            <span className={group.isHighlighted ? "highlighted-heading" : ""}>
              {group.text}
            </span>
          </React.Fragment>
        ))}
      </h2>

      {/* Right Element */}
      {rightElement && <div className="shrink-0 mb-0.5">{rightElement}</div>}

      {/* Small Accent Line (Always Visible) */}
      <div className="absolute -bottom-0.5 w-16 md:h-1 h-0.5 bg-primary bg-green-gradient" />
    </div>
  );
}

export function ViewAllLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-dark hover:underline transition-colors"
    >
      <span>{title}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
    </Link>
  );
}
