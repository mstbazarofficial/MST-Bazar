import SignUpPageClient from "@/components/auth/signup-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create an account with MST Bazar to easily order fresh groceries, organic products, track deliveries, and unlock exclusive deal discounts.",
};
export default function SignUpPage() {
  return <SignUpPageClient />;
}
