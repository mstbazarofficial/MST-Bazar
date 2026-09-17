"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type RecentUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date | string;
  image: string | null;
};

function formatDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function RecentUsers({ users }: { users: RecentUser[] }) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="flex items-center justify-between p-4 pb-3">
        <h3 className="text-base font-bold text-foreground">Recent Users</h3>
        <Link
          href="/admin/users"
          className="text-xs font-semibold text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-500"
        >
          View all &rarr;
        </Link>
      </div>

      {users.length === 0 ? (
        <p className="p-6 text-center text-sm text-muted-foreground">
          No users found.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-t border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                USER
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                EMAIL
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                JOINED DATE
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => router.push(`/admin/users/${user.id}`)}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                <TableCell className="font-semibold flex gap-2 items-center text-foreground">
                  <Avatar size="sm">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name ?? "N/A"}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(user.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
