"use client";

import ProfileAvatar from "app/components/ProfileAvatar";

interface ProfileImageProps {
  photoKey?: string | null;
  userDisplayName: string;
  isPublic?: boolean;
}

export default function ProfileImage({
  photoKey,
  userDisplayName,
  isPublic = false,
}: ProfileImageProps) {
  return (
    <ProfileAvatar
      userDisplayName={userDisplayName}
      photoKey={photoKey}
      size={24}
      className="mr-1 border"
      showLoading={true}
      isPublic={isPublic}
    />
  );
}
