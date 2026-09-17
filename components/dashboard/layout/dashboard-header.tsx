"use client";

import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLogout } from "@/hooks/use-logout";
import { authClient } from "@/lib/auth-client";

import { DashboardNav } from "./dashboard-nav";

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DashboardHeader() {
  const [openSheet, setOpenSheet] = useState(false);
  const logout = useLogout();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-header-border bg-header backdrop-blur-sm shadow-sm">
      <div className="mx-auto w-full max-w-360 flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />

            <SheetContent
              side="left"
              className="w-72 p-0 bg-background border-r border-border flex flex-col"
            >
              <div className="flex items-center px-5 h-16 border-b border-border shrink-0">
                <Link
                  href="/"
                  onClick={() => setOpenSheet(false)}
                  className="flex items-center"
                >
                  <Image
                    src="/assets/logo-vertical.png"
                    alt="MST Bazar Logo"
                    width={180}
                    height={48}
                    priority
                    className="h-8 w-auto object-contain"
                  />
                </Link>
              </div>

              <div className="px-5 py-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col truncate">
                    {isPending ? (
                      <>
                        <span className="h-3.5 w-24 rounded bg-muted animate-pulse" />
                        <span className="mt-1.5 h-3 w-32 rounded bg-muted animate-pulse" />
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-foreground leading-tight truncate">
                          {user?.name || "Guest User"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5 truncate">
                          {user?.email || ""}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Same component as the desktop sidebar — can never drift apart */}
              <div className="flex-1 overflow-y-auto p-4">
                <DashboardNav onItemClick={() => setOpenSheet(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/assets/logo-vertical.png"
              alt="MST Bazar Logo"
              width={180}
              height={48}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right: Account dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="flex items-center gap-2.5 h-auto py-1.5 px-2 hover:bg-accent rounded-full transition-colors"
              >
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:flex flex-col text-left leading-tight max-w-30">
                  <span className="text-[10px] text-muted-foreground font-medium">
                    My account
                  </span>
                  {isPending ? (
                    <span className="mt-0.5 h-3 w-16 rounded bg-muted animate-pulse" />
                  ) : (
                    <span className="text-xs font-semibold text-foreground truncate">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  )}
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
              </Button>
            }
          />

          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold leading-none text-foreground truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
