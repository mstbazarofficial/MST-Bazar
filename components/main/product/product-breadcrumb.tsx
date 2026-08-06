import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
  items: { label: string; href: string }[];
}

export function ProductBreadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground  font-medium py-4 flex-wrap">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
          )}
          {index === items.length - 1 ? (
            <span className="text-foreground font-semibold truncate">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
