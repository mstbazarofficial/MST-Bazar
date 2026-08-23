import ResetPasswordPageClient from "@/components/auth/reset-password-client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Set a new password for your MST Bazar account to restore access and secure your account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}
