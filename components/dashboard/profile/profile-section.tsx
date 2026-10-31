"use client";

import { PageHeading } from "@/components/dashboard/layout/dashboard-panel";
import { useModalParam } from "@/hooks/use-modal-param";
import { EditProfileFormModal } from "./edit-profile-form-modal";
import { ProfileInfoCard, ProfileUser } from "./profile-info-card";

interface ProfileSectionProps {
  user: ProfileUser;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [editProfile, setEditProfile] = useModalParam("edit-profile");

  return (
    <div className="space-y-5">
      <PageHeading
        title="Profile"
        description="These details fill in checkout automatically."
      />

      <ProfileInfoCard user={user} onEditClick={() => setEditProfile("true")} />

      <EditProfileFormModal
        open={!!editProfile}
        onOpenChange={(open) => !open && setEditProfile(null)}
        user={user}
        onSuccess={() => setEditProfile(null)}
      />
    </div>
  );
}
