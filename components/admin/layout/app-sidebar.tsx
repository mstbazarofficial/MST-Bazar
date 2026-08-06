// src/components/admin/layout/app-sidebar.tsx  (only the header block changes)
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "./nav-config";

async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-2">
        {!isCollapsed && (
          <SidebarMenu className="w-full">
            <SidebarMenuItem className="flex items-center gap-1">
              <SidebarMenuButton
                size="lg"
                tooltip="THM Consultency"
                render={<Link href="/admin/dashboard" />}
                className="w-full gap-3 rounded-lg data-[state=open]:bg-sidebar-accent"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-brand-amber/30 bg-brand-amber/20">
                  <Image
                    src="/assets/logo.png" // Path to your logo file
                    alt="MST Shop Logo"
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate font-heading text-sm font-bold leading-tight text-sidebar-foreground">
                    MST Shop
                  </p>
                  <p className="truncate text-[10px] leading-tight text-sidebar-foreground/50">
                    Admin Panel
                  </p>
                </div>
              </SidebarMenuButton>

              <SidebarTrigger className="hidden size-8 shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground md:flex" />
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        {isCollapsed && (
          <SidebarTrigger className="mx-auto hidden size-8 text-sidebar-foreground/60 hover:text-sidebar-foreground md:flex" />
        )}
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-3 text-[10px] uppercase tracking-widest text-sidebar-foreground/40">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link prefetch={false} href={item.href} />}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="gap-3 rounded-lg data-[state=open]:bg-sidebar-accent"
                  />
                }
              >
                <Avatar className="size-8 shrink-0 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-brand-amber/20 text-xs font-semibold text-brand-amber">
                    AD
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-medium leading-tight text-sidebar-foreground">
                      Admin
                    </p>
                    <p className="truncate text-[11px] leading-tight text-sidebar-foreground/50">
                      admin@example.com
                    </p>
                  </div>
                )}
                {!isCollapsed && (
                  <ChevronsUpDown className="size-4 shrink-0 text-sidebar-foreground/40" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
