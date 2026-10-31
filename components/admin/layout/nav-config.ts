import {
  ChartNoAxesCombined,
  ContactRound,
  Images,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  TicketPercent,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    label: "Sales",
    items: [
      {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
      },
      {
        title: "Promo Codes",
        href: "/admin/promo-codes",
        icon: TicketPercent,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        title: "Products",
        href: "/admin/products",
        icon: Package,
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: Tags,
      },
      {
        title: "Banners",
        href: "/admin/banners",
        icon: Images,
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        title: "Finance",
        href: "/admin/finance",
        icon: Wallet,
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: UsersRound,
      },
      {
        title: "Contacts",
        href: "/admin/contacts",
        icon: ContactRound,
      },
    ],
  },
];

/** The dashboard is the parent of every admin path, so it must match exactly. */
export function isNavItemActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}
