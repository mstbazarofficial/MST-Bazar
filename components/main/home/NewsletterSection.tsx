"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section className="w-full site-container section-y">
      {/* Container Box */}
      <div className="relative overflow-hidden rounded-md bg-[#EEF8F0] dark:bg-emerald-950/30 border border-emerald-100/80 dark:border-emerald-900/40 pl-6 sm:pl-8 lg:pl-12  shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 ">
        {/* Left Side: Heading & Subtitle */}
        <div className="space-y-1 sm:space-y-1.5 py-8 lg:py-12 text-center lg:text-left shrink-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#15803d] dark:text-emerald-400 tracking-tight">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            Get the latest offers and updates
          </p>
        </div>

        {/* Center: Email Subscription Form */}
        <div className="w-full max-w-md lg:max-w-lg z-10 py-8 lg:py-12">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-card dark:bg-card rounded-sm p-1.5 sm:p-2 shadow-xs border border-border/60 focus-within:border-primary/50 transition-all"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground px-3 sm:px-4 h-10 sm:h-11"
            />
            <Button
              type="submit"
              className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm rounded-sm px-5 sm:px-7 h-10 sm:h-11 transition-all shrink-0 cursor-pointer shadow-2xs active:scale-95"
            >
              {isSubscribed ? "Subscribed!" : "Subscribe"}
            </Button>
          </form>
        </div>
        <div className="px-30"></div>

        {/* Right Side: Grocery Bag Image */}
        <div className="shrink-0 flex items-center justify-center lg:justify-end absolute right-0 z-10">
          <Image
            src="/assets/grocery-bag.png"
            alt="Fresh Grocery Bag"
            width={120}
            height={120}
            loading="eager"
            className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
}
