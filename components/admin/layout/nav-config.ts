import {
  BookOpen,
  ChartNoAxesCombined,
  ContactRound,
  FileText,
  LayoutDashboard,
  Users,
  UsersRound,
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
    label: "Manage",
    items: [
      {
        title: "Products",
        href: "/admin/products",
        icon: BookOpen,
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: Users,
      },
      {
        title: "Orders",
        href: "/admin/orders",
        icon: FileText,
      },
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
