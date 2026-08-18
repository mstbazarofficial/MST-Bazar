"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Lock, HelpCircle, Leaf } from "lucide-react";
import HeadingStyle2 from "@/components/main/common/HeadingStyle2";
import { Logo } from "@/components/main/common/layout/Navbar/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // API কল এখানে বসবে
    console.log("Reset link sent to:", email);

    setIsSubmitted(true);
    setCountdown(60); // 60 seconds countdown start
  };

  // Handle Resend Link
  const handleResend = () => {
    if (countdown > 0) return;

    // রিসেন্ড API কল এখানে বসবে
    console.log("Resending link to:", email);
    setCountdown(60);
  };

  // Countdown Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-112.5 shadow-lg border-0 rounded-3xl bg-white overflow-hidden">
        <CardContent className="px-8 flex flex-col items-center">
          {/* Logo Section */}
          <Logo size={80}></Logo>

          {/* Icon Badge */}
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
            <Lock className="w-8 h-8 text-green-700" strokeWidth={2} />
            <div className="absolute bottom-4 right-4 bg-green-700 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Title & Description */}
          <HeadingStyle2
            firstTitle="Forgot"
            secondTitle="Password?"
            size="md"
            position={2}
            isUnderLine={false}
            className="mb-6"
          />

          {isSubmitted ? (
            <div className="text-center mb-8 space-y-2">
              <p className="text-gray-600 text-sm leading-relaxed px-2">
                We have sent a password reset link to <br />
                <span className="font-semibold text-gray-900">{email}</span>
              </p>
              <p className="text-sm text-gray-500">
                Please check your inbox and spam folder.
              </p>
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center leading-relaxed px-2 mb-8">
              Enter your registered email address and we'll send you a link to
              reset your password.
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-900"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitted}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-gray-200 focus-visible:ring-green-700 bg-white"
                />
              </div>
            </div>

            {/* Dynamic Button (Submit / Resend Countdown) */}
            {isSubmitted ? (
              <Button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className="w-full h-12 bg-[#2a8634] hover:bg-[#206927] text-white rounded-xl text-base font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {countdown > 0
                  ? `Resend Link in ${countdown}s`
                  : "Resend Reset Link"}
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-12 bg-[#2a8634] hover:bg-[#206927] text-white rounded-xl text-base font-semibold transition-all"
              >
                Send Reset Link
              </Button>
            )}
          </form>

          {/* Back to Login Link */}
          <div className="mt-8">
            <a
              href="#" // আপনার লগইন পেজের লিংক বসাবেন
              className="text-[#2a8634] hover:text-[#206927] font-semibold text-sm flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
