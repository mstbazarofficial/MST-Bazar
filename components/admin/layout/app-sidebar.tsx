// src/components/admin/layout/app-sidebar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { ChevronsUpDown, Loader2, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { navGroups } from "./nav-config";

function getInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    const initials =
      parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "AD";
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Close the mobile sheet after navigating to a page
  function handleNavClick() {
    if (isMobile) setOpenMobile(false);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
        onError: () => setIsSigningOut(false),
      },
    });
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-2">
        {!isCollapsed && (
          <SidebarMenu className="w-full">
            <SidebarMenuItem className="flex items-center gap-1">
              <SidebarMenuButton
                size="lg"
                tooltip="MST BAZAR "
                render={<Link href="/" onClick={handleNavClick} />}
                className="w-full  gap-3 rounded-lg data-[state=open]:bg-sidebar-accent"
              >
                <div className="flex size-8 bg-card shrink-0 items-center justify-center rounded-lg border">
                  <Image
                    src="/assets/fav-icon.png"
                    alt="MST BAZAR Logo"
                    width={32}
                    height={32}
                    className="size-8 rounded-lg p-1 bg-card object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate font-heading text-sm font-bold leading-tight text-sidebar-foreground">
                    MST BAZAR
                  </p>
                </div>
              </SidebarMenuButton>

              <SidebarTrigger className="hidden size-8 md:flex" />
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        {isCollapsed && (
          <SidebarTrigger className="mx-auto hidden size-8 md:flex" />
        )}
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={
                        <Link href={item.href} onClick={handleNavClick} />
                      }
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
                  <AvatarImage
                    src={user?.image || undefined}
                    alt={user?.name || "Admin"}
                  />
                  <AvatarFallback className="rounded-lg bg-sidebar-accent text-xs font-semibold text-sidebar-foreground">
                    {getInitials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-medium leading-tight text-sidebar-foreground">
                      {isPending ? "Loading…" : user?.name || "Admin"}
                    </p>
                    <p className="truncate text-[11px] leading-tight text-sidebar-foreground/50">
                      {isPending ? "" : user?.email}
                    </p>
                  </div>
                )}
                {!isCollapsed && (
                  <ChevronsUpDown className="size-4 shrink-0 text-sidebar-foreground/40" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-48">
                <DropdownMenuItem
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                  {isSigningOut ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-4" />
                  )}
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
