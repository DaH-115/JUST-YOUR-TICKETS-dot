"use client";

import ProfileAvatar from "app/components/ProfileAvatar";

interface ProfileImageProps {
  photoURL?: string | null;
  userDisplayName: string;
}

export default function ProfileImage({
  photoURL,
  userDisplayName,
}: ProfileImageProps) {
  return (
    <ProfileAvatar
      userDisplayName={userDisplayName}
      photoKey={photoURL}
      size={24}
      className="mr-1 border"
      showLoading={true}
    />
  );
}
