import ForgotPasswordPageClient from "@/components/auth/forgot-pass-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your MST Bazar account password. Enter your registered email address to receive password reset instructions.",
};
export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}
