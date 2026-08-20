import { UserCartCard } from "@/components/admin/users/user-cart-card";
import { UserDetailCard } from "@/components/admin/users/user-detail-card";
import { UserDetailHeader } from "@/components/admin/users/user-details-header";
import { UserOrdersTable } from "@/components/admin/users/user-orders-table";
import { UserSessionsCard } from "@/components/admin/users/user-sessions-card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const now = new Date();

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      phoneNumber: true,
      whatsappNumber: true,
      fullAddress: true,
      createdAt: true,
      banned: true,
      banReason: true,
      banExpires: true,

      orders: {
        orderBy: { orderDate: "desc" },
        select: {
          id: true,
          orderId: true,
          status: true,
          orderDate: true,
          shippingCost: true,
          discount: true,
          orderItems: {
            select: {
              price: true,
              quantity: true,
              discountPercentage: true,
            },
          },
        },
      },

      cart: {
        select: {
          items: {
            select: {
              id: true,
              quantity: true,
              product: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  discountPercentage: true,
                  images: {
                    select: { url: true, isFeatured: true },
                  },
                },
              },
            },
          },
        },
      },

      sessions: {
        where: { expiresAt: { gt: now } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          token: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!user) notFound();

  return (
    <>
      <UserDetailHeader
        user={{
          id: user.id,
          name: user.name,
          image: user.image,
          role: user.role,
          phoneNumber: user.phoneNumber,
          whatsappNumber: user.whatsappNumber,
          fullAddress: user.fullAddress,
        }}
      />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <UserDetailCard user={user} />
        <UserOrdersTable orders={user.orders} />
        <UserCartCard items={user.cart?.items ?? []} />
        <UserSessionsCard sessions={user.sessions} />
      </main>
    </>
  );
}
