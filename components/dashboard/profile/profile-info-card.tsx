"use client";

import {
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  UserCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phoneNumber?: string | null;
  whatsappNumber?: string | null;
  fullAddress?: string | null;
  emailVerified: boolean;
  createdAt: Date;
}

interface ProfileInfoCardProps {
  user: ProfileUser;
  onEditClick: () => void;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-border/60 last:border-0">
      <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground wrap-break-word">
          {value || (
            <span className="text-muted-foreground italic text-xs font-normal">
              Not provided
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileInfoCard({ user, onEditClick }: ProfileInfoCardProps) {
  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      {/* Top Banner + Avatar */}
      <div className="relative h-24 bg-linear-to-br from-primary/20 via-primary/10 to-transparent">
        <div className="absolute -bottom-10 left-6">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-card shadow-md">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {/* Small verified dot */}
            {user.emailVerified && (
              <span
                className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-card"
                title="Email verified"
              />
            )}
          </div>
        </div>
      </div>

      {/* Name + Meta */}
      <div className="pt-12 px-6 pb-4 flex items-start justify-between gap-3 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground leading-tight">
            {user.name}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Member since {memberSince}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEditClick}
          className="shrink-0 rounded-xl text-xs font-semibold"
        >
          <Camera className="h-3.5 w-3.5 mr-1.5" />
          Edit Profile
        </Button>
      </div>

      {/* Info Rows */}
      <div className="px-6 py-1">
        <InfoRow icon={Mail} label="Email Address" value={user.email} />
        <InfoRow icon={Phone} label="Phone Number" value={user.phoneNumber} />
        <InfoRow
          icon={MessageCircle}
          label="WhatsApp Number"
          value={user.whatsappNumber}
        />
        <InfoRow icon={MapPin} label="Full Address" value={user.fullAddress} />
        <InfoRow
          icon={UserCircle}
          label="Account Status"
          value={user.emailVerified ? "Verified" : "Email not verified"}
        />
      </div>
    </div>
  );
}
