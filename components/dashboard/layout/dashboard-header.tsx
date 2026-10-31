"use client";

import { ChevronDown, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
import { useLogout } from "@/hooks/use-logout";
import { authClient } from "@/lib/auth-client";

import { DashboardTabs } from "./dashboard-nav";

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DashboardHeader() {
  const logout = useLogout();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-header-border bg-header">
      <div className="mx-auto flex h-16 w-full max-w-360 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/assets/logo-vertical.png"
            alt="MST Bazar Logo"
            width={180}
            height={48}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Store className="size-4" />
            <span>Shop</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex h-auto items-center gap-2 rounded-full px-1.5 py-1 hover:bg-accent"
                >
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  {isPending ? (
                    <span className="hidden h-3 w-16 animate-pulse rounded bg-muted sm:block" />
                  ) : (
                    <span className="hidden max-w-30 truncate text-sm font-medium text-foreground sm:block">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  )}

                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>
              }
            />

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-0.5">
                    <p className="truncate text-sm leading-none font-semibold text-foreground">
                      {user?.name || "User"}
                    </p>
                    <p className="mt-1 truncate text-xs leading-none text-muted-foreground">
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
      </div>

      <div className="mx-auto w-full max-w-360 border-t border-header-border lg:hidden">
        <DashboardTabs />
      </div>
    </header>
  );
}
