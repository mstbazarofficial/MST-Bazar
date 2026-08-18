"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Leaf, ShieldCheck, Loader2 } from "lucide-react";
import { Logo } from "@/components/main/common/layout/Navbar/logo";

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Timers State
  const [expireTime, setExpireTime] = useState(300); // 5 minutes = 300 seconds
  const [resendCooldown, setResendCooldown] = useState(0); // 60 seconds cooldown for resend

  // Handle Timers (Expire & Resend)
  useEffect(() => {
    // Expire Timer Countdown
    const expireInterval = setInterval(() => {
      setExpireTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Resend Cooldown Countdown
    const resendInterval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(expireInterval);
      clearInterval(resendInterval);
    };
  }, []);

  // Format Time (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle Verify Submission
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSuccess(false);

    if (otp.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    if (expireTime === 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    setIsVerifying(true);

    // Simulate API Call for Verification
    setTimeout(() => {
      setIsVerifying(false);
      // Demo Logic: '123456' is the correct OTP
      if (otp === "123456") {
        setIsSuccess(true);
        // Redirect to dashboard or next page logic here
      } else {
        setError("Invalid OTP. Please try again.");
      }
    }, 1500);
  };

  // Handle Resend OTP
  const handleResend = () => {
    if (resendCooldown > 0) return;

    // Simulate API Call for Resend
    console.log("Resending OTP...");

    setOtp("");
    setError("");
    setIsSuccess(false);
    setExpireTime(300); // Reset expire timer to 5 mins
    setResendCooldown(60); // Start 60s cooldown for next resend
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-112.5 shadow-lg border-0 rounded-3xl bg-white overflow-hidden py-4">
        <CardContent className="p-8 sm:p-10 flex flex-col items-center">
          {/* Logo Section */}
          <Logo size={80}></Logo>

          {/* Shield Icon Badge */}
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck
              className="w-10 h-10 text-green-700"
              strokeWidth={1.5}
            />
          </div>

          {/* Title & Description */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            Enter OTP
          </h2>
          <div className="text-center mb-8 space-y-1">
            <p className="text-gray-600 text-sm">
              We have sent a 6-digit OTP to
            </p>
            <p className="font-semibold text-green-700 text-sm">
              example@email.com
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleVerify}
            className="w-full flex flex-col items-center space-y-6"
          >
            {/* OTP Input Fields */}
            <div className="flex flex-col items-center w-full">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  setError(""); // Clear error on type
                  setIsSuccess(false);
                }}
                disabled={isVerifying || expireTime === 0}
              >
                <InputOTPGroup className="flex gap-2 sm:gap-3">
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl font-semibold rounded-xl border-2 transition-all
                        ${error ? "border-red-400 focus:ring-red-500" : "border-gray-200 focus:border-green-600 focus:ring-green-600"}
                        ${isSuccess ? "border-green-500 text-green-700 bg-green-50" : "bg-white"}
                      `}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {/* Error or Success Message */}
              {error && (
                <p className="text-red-500 text-sm font-medium mt-3 animate-in fade-in">
                  {error}
                </p>
              )}
              {isSuccess && (
                <p className="text-green-600 text-sm font-medium mt-3 animate-in fade-in">
                  OTP Verified Successfully!
                </p>
              )}
            </div>

            {/* Expire Timer */}
            {!isSuccess && (
              <p className="text-gray-500 text-sm">
                OTP will expire in{" "}
                <span className="font-semibold text-green-700">
                  {formatTime(expireTime)}
                </span>
              </p>
            )}

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={
                otp.length !== 6 || isVerifying || expireTime === 0 || isSuccess
              }
              className="w-full h-12 mt-2 bg-[#2a8634] hover:bg-[#206927] text-white rounded-xl text-base font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>

          {/* Resend Link Section */}
          <div className="mt-8 text-sm text-gray-600 flex items-center gap-1">
            Didn't receive OTP?
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`font-semibold transition-colors ${
                resendCooldown > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-700 hover:text-green-800 hover:underline"
              }`}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
