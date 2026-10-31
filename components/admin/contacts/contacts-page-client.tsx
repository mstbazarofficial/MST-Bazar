"use client";

import {
  deleteContact,
  updateContactStatus,
} from "@/actions/admin/contact-mutations";
import AdminContactsSkeleton from "@/app/(admin)/admin/contacts/skeleton";
import { EmptyState } from "@/components/admin/layout/empty-state";
import { PageHeader } from "@/components/admin/layout/page-header";
import { DataTablePagination } from "@/components/my-ui/data-table-pagination";
import { ContactStatus } from "@/generated/prisma/enums";
import { adminFetch } from "@/lib/admin-fetch";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ContactRound } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ContactCard } from "./contact-card";
import { ContactFiltersBar } from "./contact-filters-bar";

export function ContactsPageClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      status: searchParams.get("status") ?? "",
      month: searchParams.get("month") ?? "",
      page: Number(searchParams.get("page")) || 1,
    }),
    [searchParams],
  );

  const { data, isFetching } = useQuery({
    queryKey: ["admin-contacts", filters],
    queryFn: () => adminFetch("contacts", filters),
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

  const handleUpdateStatus = async (id: string, status: ContactStatus) => {
    await updateContactStatus(id, status);
    queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
  };

  const handleDelete = async (id: string) => {
    const res = await deleteContact(id);
    queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
    return res;
  };

  if (!data) return <AdminContactsSkeleton />;

  const contacts = data.contacts;

  return (
    <>
      <PageHeader title="Contacts List" />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <ContactFiltersBar filters={filters} onChange={updateParams} />

        {contacts.length > 0 ? (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ContactRound}
            title="No contact submissions found."
            className="rounded-lg border bg-card"
          />
        )}

        <DataTablePagination
          currentPage={filters.page}
          pageSize={data?.pageSize ?? 20}
          totalItems={data?.total ?? 0}
          itemName="contacts"
          onPageChange={(page) => updateParams({ page: String(page) })}
        />
      </main>
    </>
  );
}
