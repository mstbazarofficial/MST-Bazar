"use server";
import { prisma } from "@/lib/prisma";

export async function searchUsersForAdmin(query: string) {
  if (!query || query.trim().length === 0) return [];

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      image: true,
      whatsappNumber: true,
      fullAddress: true,
      role: true,
      banned: true,
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phoneNumber: u.phoneNumber,
    image: u.image,
    whatsappNumber: u.whatsappNumber,
    fullAddress: u.fullAddress,
    role: u.role,
    banned: u.banned,
  }));
}
