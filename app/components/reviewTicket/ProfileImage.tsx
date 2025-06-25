"use client";

import Image from "next/image";
import { usePresignedUrl } from "app/hooks/usePresignedUrl";

interface ProfileImageProps {
  photoURL?: string | null;
  userDisplayName: string;
}

export default function ProfileImage({
  photoURL,
  userDisplayName,
}: ProfileImageProps) {
  const { url: presignedUrl, loading } = usePresignedUrl({
    key: photoURL,
  });

  if (loading) {
    return (
      <div className="mr-1 h-6 w-6 animate-pulse rounded-full border bg-gray-200"></div>
    );
  }

  return (
    <Image
      src={presignedUrl}
      alt={userDisplayName}
      width={24}
      height={24}
      className="mr-1 h-6 w-6 rounded-full border object-cover"
      onError={(e) => {
        console.warn(
          `프로필 이미지 로딩 실패: ${userDisplayName}`,
          e.currentTarget.src,
          e.type,
        );
        e.currentTarget.src = "/images/fallback-avatar.svg";
      }}
    />
  );
}
