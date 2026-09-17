"use client";

import {
  ChevronRight,
  ClipboardPlus,
  FolderPlus,
  PackagePlus,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    label: "Add Category",
    description: "Create a new product category",
    href: "/admin/categories/new",
    icon: FolderPlus,
    iconBg:
      "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  },
  {
    label: "Add Product",
    description: "List a new product for sale",
    href: "/admin/products/new",
    icon: PackagePlus,
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  },
  {
    label: "Create Order",
    description: "Place a manual order",
    href: "/admin/orders/new",
    icon: ClipboardPlus,
    iconBg:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  {
    label: "Manage User",
    description: "Register a new customer or staff",
    href: "/admin/users",
    icon: UserPlus,
    iconBg:
      "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold text-foreground">Quick Actions</h3>

      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group flex items-center justify-between rounded-lg border border-border/60 bg-card p-3.5 transition-all duration-200 hover:border-amber-500/80 hover:shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${action.iconBg}`}
              >
                <action.icon className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {action.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              </div>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
