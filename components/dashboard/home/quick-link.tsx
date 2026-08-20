import Link from "next/link";

export default function QuickLinkSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[
        {
          label: "Edit Profile",
          desc: "Update your name, email & photo",
          href: "/dashboard/profile",
        },
        {
          label: "My Orders",
          desc: "Track and manage your orders",
          href: "/dashboard/orders",
        },
        {
          label: "Security",
          desc: "Change password & manage sessions",
          href: "/dashboard/security",
        },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group bg-card border border-border rounded-2xl px-5 py-4 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all"
        >
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {item.label}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
        </Link>
      ))}
    </div>
  );
}
