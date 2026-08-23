import { getAdminCategoryById } from "@/actions/admin/category-actions";
import { CategoryFormPage } from "@/components/admin/categories/category-form-page";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
