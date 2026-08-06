import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import "server-only";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  /*   if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/"); // swap for a 403 page if you have one
  } */

  return session?.user;
}
