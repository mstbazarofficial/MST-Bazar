"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Mail, Lock, EyeOff, Eye, ArrowRight } from "lucide-react";
import HeadingStyle2 from "@/components/main/common/HeadingStyle2";
import Link from "next/link";
import AuthBg from "@/components/main/common/Auth-Bg";
import { Logo } from "@/components/main/common/layout/Navbar/logo";

// --- Login Form Component ---
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="flex items-center lg:justify-start justify-center min-h-screen bg-gray-50 relative">
      <div className="absolute  top-0 left-0 w-full h-full bg-green-700 opacity-10"></div>
      <div className="absolute top-8 left-13 z-20 flex gap-2 ">
        <Logo size={50} />
      </div>
      <AuthBg />
      <Card className="w-full max-w-md lg:ml-60 py-5 gap-1 shadow-lg z-10 rounded-2xl border-0 my-auto">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2 text-gray-900">
            <HeadingStyle2
              firstTitle="Welcome"
              secondTitle="Back"
              size="lg"
              position={2}
              isUnderLine={false}
              className="mb-0"
            />
          </CardTitle>
          <CardDescription className="text-gray-500 text-center text-sm">
            Login to your account and continue shopping with MST Bazar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10 focus-visible:ring-primary/45 focus-visible:border-none border border-primary rounded-lg h-11"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10 focus-visible:ring-primary/45 focus-visible:border-none border border-primary rounded-lg h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <Eye className="h-4 w-4 text-primary" />
                ) : (
                  <EyeOff className="h-4 w-4 text-primary" />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                className="border-primary data-[state=checked]:bg-green-700 data-[state=checked]:text-white"
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none cursor-pointer text-gray-600"
              >
                Remember me
              </Label>
            </div>
            <Link
              href="/login/forgot-password"
              className="text-sm font-semibold text-green-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <Button className="w-full bg-green-700 hover:bg-green-800 text-white rounded-lg h-12 text-base font-semibold group">
            Login
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Divider */}
          {/* <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 lowercase">
                or continue with
              </span>
            </div>
          </div> */}

          {/* Social Login */}
          {/* <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-11 rounded-lg border-primary text-gray-600 font-medium hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-lg border-primary text-gray-600 font-medium hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-2 text-[#1877F2]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div> */}

          {/* Footer Link */}
          <div className="text-center text-sm text-gray-600 mt-2">
            Don't have an account?{" "}
            <Link
              href="sign-up"
              className="text-green-700 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// --- Sign Up Form Component ---
