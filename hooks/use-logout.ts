"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function useLogout() {
  const router = useRouter();

  return async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };
}
