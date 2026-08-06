"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { navGroups } from "./nav-config";

function getPageTitle(pathname: string): string {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (
        item.href === "/admin/dashboard"
          ? pathname === item.href
          : pathname.startsWith(`${item.href}/`) || pathname === item.href
      ) {
        return item.title;
      }
    }
  }
  return "Admin";
}

export function AdminHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-sm">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      {/* Fixed: Use !h-4 and shrink-0 to prevent stretching to the top border */}
      <Separator orientation="vertical" className="h-4 my-auto shrink-0" />
      <h1 className="font-heading text-sm font-semibold text-foreground">
        {title}
      </h1>
    </header>
  );
}
