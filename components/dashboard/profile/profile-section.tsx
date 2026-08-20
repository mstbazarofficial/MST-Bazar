"use client";

import { useModalParam } from "@/hooks/use-modal-param";
import { EditProfileFormModal } from "./edit-profile-form-modal";
import { ProfileInfoCard, ProfileUser } from "./profile-info-card";

interface ProfileSectionProps {
  user: ProfileUser;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [editProfile, setEditProfile] = useModalParam("edit-profile");

  return (
    <>
      <ProfileInfoCard user={user} onEditClick={() => setEditProfile("true")} />

      <EditProfileFormModal
        open={!!editProfile}
        onOpenChange={(open) => !open && setEditProfile(null)}
        user={user}
        onSuccess={() => setEditProfile(null)}
      />
    </>
  );
}
