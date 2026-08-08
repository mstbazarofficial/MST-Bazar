import { AuthProvider } from "@/context/AuthProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | MST Shop Admin",
    default: "Dashboard | MST Shop Admin",
  },
  description: "MST Shop administration panel",
};

/**
 * Server Component — runs on every request.
 * Reads the session cookie on the server; redirects to /login if not authed.
 * No client-side auth checks needed inside /admin pages.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
