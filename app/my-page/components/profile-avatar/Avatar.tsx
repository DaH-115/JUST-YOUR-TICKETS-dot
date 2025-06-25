"use client";

import Image from "next/image";
import { usePresignedUrl } from "app/hooks/usePresignedUrl";

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
  const {
    url: presignedUrl,
    loading,
    error,
  } = usePresignedUrl({
    key: photoKey,
  });

  // previewSrc가 있으면 우선 사용 (업로드 미리보기용)
  const src = previewSrc || presignedUrl;

  return (
    <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full">
      {loading && !previewSrc ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
        </div>
      ) : (
        <Image
          src={src}
          alt={userDisplayName}
          fill
          sizes="100%"
          className="object-cover"
          onError={(e) => {
            console.error(
              "Image load error:",
              e.currentTarget.src,
              e.type,
              e.target,
            );
            // 에러 시 fallback 이미지로 교체
            e.currentTarget.src = "/images/fallback-avatar.svg";
          }}
        />
      )}
    </div>
  );
}
