"use client";

import Image from "next/image";
import { useState } from "react";
import { usePresignedUrl } from "app/hooks/usePresignedUrl";

interface ProfileAvatarProps {
  userDisplayName: string;
  photoKey?: string | null;
  previewSrc?: string | null;
  size?: number;
  className?: string;
  showLoading?: boolean;
}

export default function ProfileAvatar({
  userDisplayName,
  photoKey,
  previewSrc = null,
  size = 48,
  className = "",
  showLoading = true,
}: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // photoKey는 항상 S3 key
  const { url: presignedUrl, loading } = usePresignedUrl({
    key: photoKey,
  });

  // previewSrc가 있으면 우선 사용, 없으면 presignedUrl 사용
  const src = previewSrc || presignedUrl;

  // 이미지를 표시할지 여부 결정
  const shouldShowImage = !imageError && photoKey && src;

  // 닉네임의 첫 글자 추출
  const firstLetter = userDisplayName
    ? userDisplayName.charAt(0).toUpperCase()
    : "U";

  // 회색 배경 통일
  const backgroundColorClass = "bg-gray-500";

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {loading && !previewSrc && showLoading ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
        </div>
      ) : shouldShowImage && src ? (
        <Image
          src={src}
          alt={userDisplayName || "User"}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={(e) => {
            console.warn(
              `프로필 이미지 로딩 실패: ${userDisplayName}`,
              e.currentTarget.src,
            );
            setImageError(true);
          }}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center ${backgroundColorClass}`}
        >
          <span
            className="select-none font-bold text-white"
            style={{ fontSize: size * 0.4 }}
          >
            {firstLetter}
          </span>
        </div>
      )}
    </div>
  );
}
