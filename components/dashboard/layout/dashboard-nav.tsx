"use client";

import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLogout } from "@/hooks/use-logout";

// Single source of truth — imported by DashboardHeader too, so
// desktop sidebar and mobile sheet can never drift apart.
export const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Profile Information", href: "/dashboard/profile", icon: User },
  { title: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
  {
    title: "Security Settings",
    href: "/dashboard/security",
    icon: ShieldCheck,
  },
];

interface DashboardNavProps {
  onItemClick?: () => void;
}

export function DashboardNav({ onItemClick }: DashboardNavProps) {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-medium text-muted-foreground/70">
            My account
          </p>
        </div>

        <nav aria-label="Account navigation" className="px-2 pb-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <nav className="p-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
          >
            <LogOut className="h-4 w-4 shrink-0 group-hover:text-destructive transition-colors" />
            <span>Log out</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
