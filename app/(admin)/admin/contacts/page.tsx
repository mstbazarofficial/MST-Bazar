// app/admin/orders/page.tsx
import { getAdminContacts } from "@/actions/admin/contact-actions";
import { ContactsPageClient } from "@/components/admin/contacts/contacts-page-client";

type SearchParams = {
  search?: string;
  status?: string;
  month?: string;
  page?: string;
};

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    search: params.search,
    status: params.status,
    month: params.month,
    page: Number(params.page) || 1,
  };

  const initialData = await getAdminContacts(filters);

  return (
    <ContactsPageClient initialData={initialData} initialFilters={filters} />
  );
}
