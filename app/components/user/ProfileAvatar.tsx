"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePresignedUrl } from "app/components/user/hooks/usePresignedUrl";

/**
 * 프로필 아바타 컴포넌트
 * @param userDisplayName 사용자 이름(필수)
 * @param s3photoKey S3 이미지 키(선택)
 * @param previewSrc 외부 이미지 URL(선택)
 * @param size 아바타 크기(px)
 * @param className 추가 클래스
 * @param showLoading 로딩 스피너 표시 여부
 * @param isPublic S3 공개 여부
 * @param onImageError 이미지 로딩 실패 시 콜백
 */
interface ProfileAvatarProps {
  userDisplayName: string;
  s3photoKey?: string;
  previewSrc?: string;
  size?: number;
  className?: string;
  showLoading?: boolean;
  isPublic?: boolean;
  onImageError?: () => void;
}

export default function ProfileAvatar({
  userDisplayName,
  s3photoKey,
  previewSrc,
  size = 48,
  className = "",
  showLoading = true,
  isPublic = false,
  onImageError,
}: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // src 계산 함수: previewSrc > presignedUrl > undefined
  const { url: presignedUrl, loading } = usePresignedUrl({
    key: isVisible && s3photoKey ? s3photoKey : null,
    isPublic,
  });
  const getImageSrc = () => {
    if (previewSrc) return previewSrc;
    if (s3photoKey) return presignedUrl;
    return undefined;
  };
  const src = getImageSrc();

  // S3 presignedUrl이 필요한 경우에만 Intersection Observer 사용
  useEffect(() => {
    if (!s3photoKey) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [s3photoKey]);

  // 이미지 소스가 바뀔 때 에러 상태 초기화
  useEffect(() => {
    setImageError(false);
  }, [previewSrc, s3photoKey]);

  // 이미지 표시 조건: src만 있으면 됨
  const shouldShowImage = !imageError && src;

  // 닉네임의 첫 글자 추출
  const firstLetter = userDisplayName
    ? userDisplayName.charAt(0).toUpperCase()
    : "U";

  // 회색 배경 통일
  const backgroundColorClass = "bg-gray-500";

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
      aria-label={
        userDisplayName ? `${userDisplayName} 프로필 이미지` : "프로필 이미지"
      }
      data-testid="profile-avatar"
    >
      {loading && !previewSrc && showLoading ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          <div
            className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
            aria-label="로딩 중"
          ></div>
        </div>
      ) : shouldShowImage && src ? (
        <Image
          src={src}
          alt={userDisplayName || "User"}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => {
            setImageError(true);
            if (onImageError) onImageError();
          }}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center ${backgroundColorClass}`}
        >
          {/* fallback: 이니셜 */}
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
