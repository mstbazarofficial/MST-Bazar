"use client";

import AdminUsersSkeleton from "@/app/(admin)/admin/users/skeleton";
import { PageHeader } from "@/components/admin/layout/page-header";
import { DataTablePagination } from "@/components/my-ui/data-table-pagination";
import { Button } from "@/components/ui/button";
import { useModalParam } from "@/hooks/use-modal-param";
import { adminFetch } from "@/lib/admin-fetch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { UserFiltersBar } from "./user-filters-bar";
import { CreateUserFormModal } from "./user-form";
import { UsersTable } from "./users-table";

export function UsersPageClient() {
  const pathname = usePathname();
  const [createUser, setCreateUser] = useModalParam("new");
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      role: searchParams.get("role") ?? "",
      month: searchParams.get("month") ?? "",
      page: Number(searchParams.get("page")) || 1,
    }),
    [searchParams],
  );

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => adminFetch("users", filters),
    placeholderData: keepPreviousData,
  });

  const updateParams = useCallback(
    (updates: Record<string, string | undefined | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      if (!("page" in updates)) next.set("page", "1");

      window.history.pushState(null, "", `${pathname}?${next.toString()}`);
    },
    [pathname, searchParams],
  );

  if (!data) return <AdminUsersSkeleton />;

  return (
    <>
      <PageHeader
        actions={
          <Button onClick={() => setCreateUser("true")} size="sm">
            <Plus className="size-4" />
            Create User
          </Button>
        }
        title="Users List"
      />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <UserFiltersBar filters={filters} onChange={updateParams} />

        <UsersTable users={data?.users ?? []} isFetching={isFetching} />

        <DataTablePagination
          currentPage={filters.page}
          pageSize={data?.pageSize ?? 20}
          totalItems={data?.total ?? 0}
          itemName="users"
          onPageChange={(page) => updateParams({ page: String(page) })}
        />
      </main>
      <CreateUserFormModal
        open={createUser === "true"}
        onOpenChange={(open) => setCreateUser(open ? "true" : null)}
        onSuccess={() => {
          setCreateUser(null);
          refetch();
        }}
      />
    </>
  );
}
