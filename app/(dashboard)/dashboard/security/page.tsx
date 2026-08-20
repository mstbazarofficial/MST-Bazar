import { SecuritySection } from "@/components/dashboard/security/security-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SecurityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <SecuritySection email={session.user.email} />
    </div>
  );
}
