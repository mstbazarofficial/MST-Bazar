export const dynamic = "force-dynamic";

import QuickLinkSection from "@/components/dashboard/home/quick-link";
import StatsSection from "@/components/dashboard/home/stats";
import WelcomeSection from "@/components/dashboard/home/welcome";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Run all count queries concurrently using Prisma
  const [total, delivered, inProgress, pending] = await Promise.all([
    prisma.order.count({
      where: { userId },
    }),
    prisma.order.count({
      where: { userId, status: "DELIVERED" },
    }),
    prisma.order.count({
      where: {
        userId,
        status: { in: ["PROCESSING", "SHIPPED"] },
      },
    }),
    prisma.order.count({
      where: { userId, status: "PENDING" },
    }),
  ]);

  return (
    <section className="dashboard-container">
      <WelcomeSection />

      <StatsSection
        stats={{
          total,
          delivered,
          inProgress,
          pending,
        }}
      />

      <QuickLinkSection />
    </section>
  );
}
