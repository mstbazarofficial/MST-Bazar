import { Badge } from "@/components/ui/badge";
import { Clock, Globe, Monitor, Smartphone } from "lucide-react";

interface SessionRow {
  id: string;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiresAt: Date;
}

function parseDevice(ua: string | null): {
  label: string;
  icon: React.ElementType;
} {
  if (!ua) return { label: "Unknown device", icon: Globe };
  const u = ua.toLowerCase();
  if (u.includes("mobile") || u.includes("android") || u.includes("iphone"))
    return { label: "Mobile", icon: Smartphone };
  return { label: "Desktop", icon: Monitor };
}

function parseBrowser(ua: string | null): string {
  if (!ua) return "Unknown browser";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera")) return "Opera";
  return "Browser";
}

export function UserSessionsCard({ sessions }: { sessions: SessionRow[] }) {
  const now = new Date();
  const active = sessions.filter((s) => new Date(s.expiresAt) > now);

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(d));

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Monitor className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Active Sessions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {active.length} active session{active.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {active.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">No active sessions.</p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {active.map((session) => {
            const { label, icon: DeviceIcon } = parseDevice(session.userAgent);
            const browser = parseBrowser(session.userAgent);

            return (
              <div
                key={session.id}
                className="flex items-start gap-4 px-5 py-4"
              >
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border/60">
                  <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">
                      {browser} · {label}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      Active
                    </Badge>
                  </div>

                  {session.ipAddress && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {session.ipAddress}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Started {fmt(session.createdAt)} · Expires{" "}
                    {fmt(session.expiresAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
