"use client";

import { PageHeader } from "@/components/admin/layout/page-header";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@/generated/prisma/enums";
import { useModalParam } from "@/hooks/use-modal-param";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { Lock, MoreVertical, Pencil, ShieldAlert, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditMode, UpdateUserModal } from "./update-user-modal";

type UserDetailHeaderProps = {
  user: {
    id: string;
    name: string;
    image?: string | null;
    role?: Role;
    phoneNumber?: string | null;
    whatsappNumber?: string | null;
    fullAddress?: string | null;
  };
};

export function UserDetailHeader({ user }: UserDetailHeaderProps) {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  // URL search param manages modal state: ?edit=general | role | password
  const [editParam, setEditParam] = useModalParam("edit");
  const editMode = (editParam as EditMode) || null;

  const currentUserRole = session?.user?.role?.toString().toUpperCase();
  const isAdmin = currentUserRole === Role.ADMIN || currentUserRole === "ADMIN";

  const handleDeleteUser = async () => {
    await authClient.admin.removeUser({ userId: user.id });
    await queryClient.resetQueries({ queryKey: ["admin-users"] });
    router.push("/admin/users");
  };

  return (
    <>
      <PageHeader
        title={user.name}
        backHref="/admin/users"
        actions={
          isAdmin && (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline" size="icon" className="size-8">
                      <MoreVertical className="size-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent
                  align="end"
                  className="w-48 p-1.5 flex flex-col gap-1"
                >
                  <DropdownMenuItem onClick={() => setEditParam("general")}>
                    <Pencil className="size-4 mr-2 text-muted-foreground" />
                    Edit Info
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setEditParam("role")}>
                    <ShieldAlert className="size-4 mr-2 text-muted-foreground" />
                    Change Role
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setEditParam("password")}>
                    <Lock className="size-4 mr-2 text-muted-foreground" />
                    Set Password
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DeleteDialog
                    title="Delete user?"
                    description={`Are you sure you want to delete "${user.name}"? This action cannot be undone.`}
                    action={handleDeleteUser}
                    successMessage="User deleted successfully."
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full justify-start gap-2"
                      aria-label="Delete User"
                    >
                      <Trash2 className="size-4" />
                      Delete User
                    </Button>
                  </DeleteDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        }
      />

      <UpdateUserModal
        user={user}
        editMode={editMode}
        onClose={() => setEditParam(null)}
      />
    </>
  );
}
