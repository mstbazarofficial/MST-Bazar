"use client";

import { AuthBg } from "@/components/auth/auth-bg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Loader2, Mail, MailCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setServerError(null);

    try {
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setServerError(error.message || "Failed to request password reset.");
      } else {
        setSubmittedEmail(values.email);
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setServerError(
        err?.message || "An unexpected error occurred. Please try again.",
      );
    }
  };

  return (
    <section className="h-screen w-full overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden bg-background relative flex flex-col justify-between">
      <div className="absolute top-0 left-0 w-full h-full bg-primary/10 pointer-events-none" />
      <AuthBg />

      <section className="flex w-full min-h-full items-center justify-center lg:justify-start lg:pl-28 px-0 sm:px-4 py-0 sm:py-12 z-10">
        <Card className="w-full min-h-screen sm:min-h-0 sm:max-w-md py-8 sm:py-6 gap-1 border-0 sm:border border-border rounded-none sm:rounded-2xl shadow-none sm:shadow-xl bg-background sm:bg-card text-card-foreground backdrop-blur-sm my-auto flex flex-col justify-center px-2 sm:px-0">
          {/* Logo */}
          <div className="flex justify-center pt-2 pb-1">
            <Link
              href="/"
              className="flex shrink-0 items-center"
              aria-label="Go to homepage"
            >
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={48}
                height={48}
                priority
                className=" w-auto"
              />
            </Link>
          </div>

          <CardHeader className="space-y-1 pb-4 px-6 sm:px-6">
            <CardTitle className="text-2xl font-bold flex items-center justify-center text-foreground">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-muted-foreground text-center text-sm">
              {isSubmitted
                ? "Reset link sent to your email"
                : "Enter your registered email address to receive a reset link"}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-6">
            {isSubmitted ? (
              <div className="space-y-6 text-center pt-2">
                <div className="flex justify-center">
                  <div className="h-16 w-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                    <MailCheck className="h-8 w-8 text-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We have sent a password reset link to{" "}
                    <span className="font-semibold text-foreground">
                      {submittedEmail}
                    </span>
                  </p>
                </div>

                <div className="p-4 bg-muted border border-border rounded-xl text-xs text-muted-foreground text-left space-y-1">
                  <p className="font-semibold text-foreground">
                    ⚡ Didn't receive the email?
                  </p>
                  <p>
                    Check your <strong>Spam</strong> or <strong>Junk</strong>{" "}
                    folder.
                  </p>
                </div>

                <Link href="/login" className="block w-full">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg h-11 text-base font-semibold">
                    Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Global Server Error */}
                {serverError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      {...register("email")}
                      className="pl-10 border-input focus-visible:border-ring rounded-lg h-11"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg h-11 text-base font-semibold group mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                {/* Back to Login Link */}
                <div className="text-center pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm font-semibold text-primary hover:underline gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
