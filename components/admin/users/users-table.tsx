// users-table.tsx
"use client";

import {
  EmptyState,
  TableEmptyRow,
} from "@/components/admin/layout/empty-state";
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
import { formatDate } from "@/utils/format-date";
import { CheckCircle2, User, UsersRound, XCircle } from "lucide-react";
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
        "transition-opacity duration-200",
        isFetching && "opacity-50 pointer-events-none select-none",
      )}
    >
      {/* Phones and tablets: one card per user */}
      <div className="space-y-3 lg:hidden">
        {users.length === 0 && (
          <EmptyState
            icon={UsersRound}
            title="No users found."
            className="rounded-lg border bg-card"
          />
        )}

        {users.map((user) => (
          <Link
            key={user.id}
            href={`/admin/users/${user.id}`}
            className="block space-y-2 rounded-lg border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`shrink-0 border-transparent ${getRoleColor(user.role)}`}
              >
                {user.role}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {user.phoneNumber || "No phone"} · Joined{" "}
              {formatDate(user.createdAt)}
            </p>
          </Link>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border bg-card lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-64 pl-4">User</TableHead>
              <TableHead className="w-40">Phone</TableHead>
              <TableHead className="w-32 text-center">Role</TableHead>
              <TableHead className="w-32 text-center">Verified</TableHead>
              <TableHead className="w-36 text-right pr-4">
                Joined Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableEmptyRow
                colSpan={5}
                icon={UsersRound}
                title="No users found."
              />
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
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
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
