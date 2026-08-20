import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/generated/prisma/enums";
import {
  Calendar,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

interface UserDetailCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: Role;
    emailVerified: boolean;
    phoneNumber: string | null;
    whatsappNumber: string | null;
    fullAddress: string | null;
    createdAt: Date;
  };
}

const ROLE_STYLES: Record<Role, string> = {
  ADMIN:
    "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800",
  MODERATOR:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  CUSTOMER:
    "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
    <div className="flex items-start gap-3 py-3 border-b border-border/60 last:border-0">
      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground wrap-break-word">
          {value ?? (
            <span className="text-muted-foreground italic text-xs font-normal">
              Not provided
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

  const onEdit = () => {};

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      {/* Banner */}
      <div className="relative h-20 bg-linear-to-br from-primary/20 via-primary/10 to-transparent">
        <div className="absolute -bottom-9 left-5">
          <Avatar className="h-18 w-18 border-4 border-card shadow-md">
            <AvatarImage src={user.image ?? ""} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Header & Actions Row */}
      <div className="pt-11 px-5 pb-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-foreground">{user.name}</h2>
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLES[user.role]}`}
            >
              {user.role}
            </Badge>
            {user.emailVerified && (
              <Badge
                variant="outline"
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800"
              >
                <ShieldCheck className="h-2.5 w-2.5 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Member since {memberSince} · ID: {user.id}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-1">
        <InfoRow icon={Mail} label="Email" value={user.email} />
        <InfoRow icon={Phone} label="Phone" value={user.phoneNumber} />
        <InfoRow
          icon={MessageCircle}
          label="WhatsApp"
          value={user.whatsappNumber}
        />
        <InfoRow icon={MapPin} label="Address" value={user.fullAddress} />
        <InfoRow
          icon={Calendar}
          label="Joined"
          value={new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
            new Date(user.createdAt),
          )}
        />
      </div>
    </div>
  );
}
