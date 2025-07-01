"use client";

import ProfileAvatar from "app/components/ProfileAvatar";

interface AvatarProps {
  userDisplayName: string;
  photoKey?: string;
  previewSrc?: string | null;
}

export default function Avatar({
  userDisplayName,
  photoKey,
  previewSrc = null,
}: AvatarProps) {
  return (
    <ProfileAvatar
      userDisplayName={userDisplayName}
      photoKey={photoKey}
      previewSrc={previewSrc}
      size={96}
      className="mx-auto"
      showLoading={true}
    />
  );
}
