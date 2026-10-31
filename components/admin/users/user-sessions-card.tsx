import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/utils/format-date";
import { Globe, Monitor, Smartphone, type LucideIcon } from "lucide-react";

interface SessionRow {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiresAt: Date;
}

function parseDevice(ua: string | null): {
  label: string;
  icon: LucideIcon;
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex min-h-8 items-center text-base font-semibold">
          Active sessions
        </CardTitle>
      </CardHeader>

      <CardContent>
        {sessions.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center text-muted-foreground">
            <Monitor className="size-5" />
            <p className="text-sm">No active sessions.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => {
              const { label, icon: DeviceIcon } = parseDevice(
                session.userAgent,
              );

              return (
                <div
                  key={session.id}
                  className="flex items-start gap-3 rounded-xl bg-muted/50 p-3"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <DeviceIcon className="size-3.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {parseBrowser(session.userAgent)} · {label}
                      </p>
                      <Badge
                        variant="outline"
                        className="border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      >
                        Active
                      </Badge>
                    </div>
                    {session.ipAddress && (
                      <p className="text-xs text-muted-foreground">
                        {session.ipAddress}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Started {formatDateTime(session.createdAt)} · Expires{" "}
                      {formatDateTime(session.expiresAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
