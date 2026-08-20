"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  whatsappNumber: z.string().optional(),
  fullAddress: z.string().optional(),
});
type ProfileInput = z.infer<typeof profileSchema>;

export async function updateUserProfile({
  userId,
  input,
}: {
  userId: string;
  input: ProfileInput;
}) {
  // 1. Fetch Better Auth session from incoming headers
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false as const, error: "Unauthorized access." };
  }

  // 2. Authorization check
  if (session.user.id !== userId) {
    return {
      success: false as const,
      error: "Forbidden: You can only update your own profile.",
    };
  }

  // 3. Validate payload
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues };
  }

  try {
    // 4. Update database record via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
    });

    revalidatePath("/dashboard/profile");

    return { success: true as const, data: updatedUser };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return {
      success: false as const,
      error: "Something went wrong while saving your profile.",
    };
  }
}
