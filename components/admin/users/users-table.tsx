// users-table.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { CheckCircle2, User, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phoneNumber: string | null;
  role: Role;
  emailVerified: boolean;
  createdAt: Date;
};

interface UsersTableProps {
  users: UserRow[];
  isFetching?: boolean;
}

export function UsersTable({ users, isFetching }: UsersTableProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden transition-opacity duration-200",
        isFetching && "opacity-50 pointer-events-none select-none",
      )}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-64 pl-4">User</TableHead>
            <TableHead className="w-40">Phone</TableHead>
            <TableHead className="w-32 text-center">Role</TableHead>
            <TableHead className="w-32 text-center">Verified</TableHead>
            <TableHead className="w-36 text-right pr-4">Joined Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32 text-center text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="group relative hover:bg-muted/50 transition-colors"
              >
                {/* User Info Cell (Avatar + Name + Email) */}
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted border">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={36}
                          height={36}
                          className="size-full object-cover"
                        />
                      ) : (
                        <User className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors focus:outline-none after:absolute after:inset-0"
                      >
                        {user.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Phone Cell */}
                <TableCell className="text-sm text-muted-foreground">
                  {user.phoneNumber || "—"}
                </TableCell>

                {/* Role Cell */}
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`border-transparent ${getRoleColor(user.role)}`}
                  >
                    {user.role}
                  </Badge>
                </TableCell>

                {/* Verified Cell */}
                <TableCell className="text-center">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center justify-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-4" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
                      <XCircle className="size-4" /> Unverified
                    </span>
                  )}
                </TableCell>

                {/* Joined Date Cell */}
                <TableCell className="text-right pr-4 text-muted-foreground text-sm">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(user.createdAt))}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function getRoleColor(role: Role) {
  switch (role) {
    case Role.ADMIN:
      return "bg-rose-500/15 text-rose-700 dark:text-rose-400";
    case Role.MODERATOR:
      return "bg-purple-500/15 text-purple-700 dark:text-purple-400";
    case Role.CUSTOMER:
    default:
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400";
  }
}
