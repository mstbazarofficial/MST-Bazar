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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MailWarning,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPageClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const rememberVal = watch("remember");

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setUnverifiedEmail(null);
    setResendSuccess(false);

    try {
      const { error: authError } = await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              setUnverifiedEmail(values.email);
            }
          },
        },
      );

      if (authError) {
        if (authError.status !== 403) {
          setServerError(authError.message || "Invalid email or password.");
        }
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setServerError(
        err?.message || "An unexpected error occurred. Please try again.",
      );
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setResending(true);
    setServerError(null);

    try {
      await authClient.sendVerificationEmail({
        email: unverifiedEmail,
        callbackURL: "/",
      });
      setResendSuccess(true);
    } catch (err: any) {
      setServerError(err?.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="h-screen w-full overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden bg-background relative flex flex-col justify-between">
      <div className="absolute top-0 left-0 w-full h-full bg-primary/10 pointer-events-none" />
      <AuthBg />

      <section className="flex w-full min-h-full items-center justify-center lg:pr-58 px-0 sm:px-4 py-0 sm:py-12 z-10">
        <Card className="w-full min-h-screen sm:min-h-0 sm:max-w-md py-8 sm:py-6 gap-1 border-0 sm:border border-border rounded-none sm:rounded-2xl shadow-none sm:shadow-xl bg-background sm:bg-card text-card-foreground backdrop-blur-sm my-auto flex flex-col justify-center px-2 sm:px-0">
          {/* Logo */}
          <div className="flex justify-center pt-2 pb-1">
            <Link
              href="/"
              className="flex shrink-0 items-center"
              aria-label="Go to homepage"
            >
              <Image
                src="/assets/logo-vertical.png"
                alt="Logo"
                width={100}
                height={48}
                priority
                className=" w-auto"
              />
            </Link>
          </div>

          <CardHeader className="space-y-1 pb-4 px-6 sm:px-6">
            <CardTitle className="text-2xl font-bold flex items-center justify-center text-foreground">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-center text-sm">
              Login to your account and continue shopping with MST Bazar
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Global Server Error */}
              {serverError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Email Unverified Alert & Resend Option */}
              {unverifiedEmail && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-xl space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MailWarning className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-semibold">Email Not Verified</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Please verify your email address to log in. Check your
                        inbox and spam folder.
                      </p>
                    </div>
                  </div>

                  {resendSuccess ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium pt-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verification email sent successfully!</span>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendVerification}
                      disabled={resending}
                      className="w-full text-xs h-8 mt-1 border-amber-500/40 hover:bg-amber-500/10"
                    >
                      {resending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : null}
                      Resend Verification Email
                    </Button>
                  )}
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

              {/* Password Field */}
              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className="pl-10 pr-10 border-input focus-visible:border-ring rounded-lg h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-primary" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberVal}
                    onCheckedChange={(checked) =>
                      setValue("remember", checked === true)
                    }
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-xs font-medium leading-none cursor-pointer text-muted-foreground"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg h-11 text-base font-semibold group mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Login
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {/* Footer Link */}
              <div className="text-center text-sm text-muted-foreground pt-1">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-primary font-semibold hover:underline"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
