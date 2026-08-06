import { getAdminCategories } from "@/actions/admin/category-actions";
import { CategoryRowActions } from "@/components/admin/categories/category-row-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export async function CategoriesTable({ search }: { search?: string }) {
  const categories = await getAdminCategories(search);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {categories.length} categor{categories.length === 1 ? "y" : "ies"}
      </p>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="[&_th]:py-3">
              <TableHead className="w-16 text-center">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-24 text-center">Products</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow
                  key={category.id}
                  className="[&_td]:py-2 [&_td]:align-middle"
                >
                  <TableCell>
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-muted">
                      {category.image && (
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">{category.name}</TableCell>

                  <TableCell className="text-muted-foreground">
                    {category.slug}
                  </TableCell>

                  <TableCell className="text-center text-muted-foreground">
                    {category._count.products}
                  </TableCell>

                  <TableCell className="text-right">
                    <CategoryRowActions
                      categoryId={category.id}
                      categoryName={category.name}
                    />
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
