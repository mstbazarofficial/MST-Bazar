import { ProfileSection } from "@/components/dashboard/profile/profile-section";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // 1. Get authenticated session via Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // 2. Fetch user profile data from Prisma
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phoneNumber: true,
      whatsappNumber: true,
      fullAddress: true,
      createdAt: true,
      emailVerified: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <ProfileSection user={user} />
    </div>
  );
}
