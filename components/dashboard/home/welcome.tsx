'use client";';
import { authClient } from "@/lib/auth-client";
import { ShoppingBag } from "lucide-react";

export default function WelcomeSection() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  return (
    <div className="rounded-2xl bg-primary-dark px-6 py-5 flex items-center justify-between shadow-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
      <div className="relative">
        <p className="text-primary-foreground/70 text-sm font-medium">
          Welcome back,
        </p>
        <h1 className="text-xl font-bold text-primary-foreground mt-0.5">
          {user?.name || "user"} 👋
        </h1>
        <p className="text-primary-foreground/60 text-xs mt-1">
          Here's what's happening with your account today.
        </p>
      </div>
      <ShoppingBag className="h-12 w-12 text-primary-foreground/15 shrink-0 relative" />
    </div>
  );
}
