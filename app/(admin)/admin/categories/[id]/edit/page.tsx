import { getAdminCategoryById } from "@/actions/admin/category-actions";
import { CategoryFormPage } from "@/components/admin/categories/category-form-page";
import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const category = await getAdminCategoryById(id);

  if (!category) notFound();

  return (
    <CategoryFormPage
      mode="edit"
      categoryId={category.id}
      initialValues={{
        name: category.name,
        inputSlug: category.slug,
        image: category.image ?? "",
        priority: category.priority,
      }}
    />
  );
}
