"use client";

import {
  BadgeCheck,
  LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
} from "lucide-react";

import { Panel } from "@/components/dashboard/layout/dashboard-panel";
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
  icon: LucideIcon;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd
          className={`mt-0.5 text-sm font-medium wrap-break-word ${
            value ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {value || "Not added"}
        </dd>
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
  const memberSince = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(user.createdAt));

  const fields = [
    user.name,
    user.email,
    user.phoneNumber,
    user.whatsappNumber,
    user.fullAddress,
  ];
  const completion = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100,
  );

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
      <Panel>
        <div className="h-24 bg-brand-gradient" />
        <div className="-mt-12 flex flex-col items-center px-5 pb-5 text-center">
          <Avatar className="size-24 border-4 border-card bg-card shadow-sm">
            <AvatarImage src={user.image ?? ""} alt={user.name} />
            <AvatarFallback className="bg-accent text-2xl font-semibold text-accent-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-3 flex max-w-full items-center gap-1.5">
            <h2 className="truncate text-lg font-semibold text-foreground">
              {user.name}
            </h2>
            {user.emailVerified && (
              <BadgeCheck
                className="size-5 shrink-0 text-primary"
                aria-label="Email verified"
              />
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Member since {memberSince}
          </p>

          <div className="mt-5 w-full text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Profile complete</span>
              <span className="font-semibold text-foreground tabular-nums">
                {completion}%
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <Button onClick={onEditClick} className="mt-5 w-full">
            <Pencil className="size-4" />
            Edit profile
          </Button>
        </div>
      </Panel>

      <Panel title="Personal details">
        <dl className="grid grid-cols-1 gap-3 px-5 pb-5 md:grid-cols-2">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Phone} label="Phone" value={user.phoneNumber} />
          <InfoRow
            icon={MessageCircle}
            label="WhatsApp"
            value={user.whatsappNumber}
          />
          <InfoRow icon={MapPin} label="Address" value={user.fullAddress} />
        </dl>
      </Panel>
    </div>
  );
}
