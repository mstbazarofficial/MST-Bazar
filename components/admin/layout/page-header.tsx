// src/components/admin/layout/page-header.tsx
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface PageHeaderProps {
  title: React.ReactNode;
  backHref?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  backHref,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className="bg-header">
      <div
        className={cn(
          "sticky top-0 z-5  flex h-14 shrink-0 items-center justify-between gap-3 border-b border-header-border  mx-auto w-full max-w-360 px-4 sm:px-6 backdrop-blur-sm",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {/* Only needed on mobile since the sidebar is persistent on desktop */}
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground md:hidden" />
          <Separator
            orientation="vertical"
            className="my-auto h-4 shrink-0 md:hidden"
          />

          {backHref && (
            <Link
              href={backHref}
              aria-label="Go back"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "-ml-1.5 size-8 shrink-0",
              })}
            >
              <ArrowLeft className="size-4" />
            </Link>
          )}

          <h1 className="truncate text-base lg:text-lg font-semibold text-foreground">
            {title}
          </h1>
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}
