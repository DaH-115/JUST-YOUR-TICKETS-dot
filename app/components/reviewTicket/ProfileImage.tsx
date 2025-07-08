"use client";

import ProfileAvatar from "app/components/ProfileAvatar";

interface ProfileImageProps {
  photoKey?: string | null;
  userDisplayName: string;
}

export default function ProfileImage({
  photoKey,
  userDisplayName,
}: ProfileImageProps) {
  return (
    <ProfileAvatar
      userDisplayName={userDisplayName}
      photoKey={photoKey}
      size={24}
      className="mr-1 border"
      showLoading={true}
    />
  );
}
