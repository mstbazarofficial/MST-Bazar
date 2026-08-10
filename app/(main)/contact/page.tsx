"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldGroup, FieldSet } from "@/components/ui/field";
import {
  Headset,
  Clock,
  UserCheck,
  ShieldCheck,
  HeartHandshake,
  Phone,
  Mail,
  MapPin,
  Send,
  Package,
  CreditCard,
  RefreshCcw,
  User,
  Shield,
  Undo2,
  Lock,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { ContactHero } from "@/components/main/contact/ContactHero";
import { ContactInfoSection } from "@/components/main/contact/ContactInfoSection";
import { ContactFormSection } from "@/components/main/contact/ContactFormSection";
import { FAQSection } from "@/components/main/contact/FAQSection";
import { FeatureBanner } from "@/components/main/contact/FeatureBanner";

// ==========================================
// 1. Breadcrumb Component
// ==========================================
export function BreadcrumbNav() {
  return (
    <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
      <span className="hover:text-gray-900 cursor-pointer">Home</span>
      <span className="text-gray-400">›</span>
      <span className="text-gray-900 font-medium">Contact Us</span>
    </div>
  );
}
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-10">
      <div className="site-container section-y">
        {/* Breadcrumb */}
        <BreadcrumbNav />

        {/* Hero Section */}
        <ContactHero />

        {/* Main Content (Contact Info & Form) */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left Column - 40% width on large screens */}
            <div className="lg:col-span-2">
              <ContactInfoSection />
            </div>

            {/* Right Column - 60% width on large screens */}
            <div className="lg:col-span-3 lg:border-l lg:border-primary/45 lg:pl-12">
              <ContactFormSection />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />

        {/* Bottom Features Banner */}
        <FeatureBanner />
      </div>
    </div>
  );
}
