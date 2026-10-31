import LoginPageClient from "@/components/auth/login-client";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your MST Bazar account to manage your orders, track shipments, and experience seamless shopping.",
};
export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageClient />
    </Suspense>
  );
}
