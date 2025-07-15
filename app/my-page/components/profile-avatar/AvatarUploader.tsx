"use client";

import { useState, ChangeEvent, useRef } from "react";
import {
  MAX_FILE_SIZE,
  ALLOWED_CONTENT_TYPES,
  ALLOWED_EXTENSIONS,
  formatFileSize,
  validateFileExtension,
} from "app/constants/fileUpload";

interface AvatarUploaderProps {
  previewSrc: string | null;
  onPreview: (url: string | null) => void;
  onCancelPreview: () => void;
  onFileSelect: (file: File | null) => void;
  onImageChange?: (hasChanged: boolean) => void;
  onError?: (message: string) => void;
}

export default function AvatarUploader({
  onPreview,
  onCancelPreview,
  onFileSelect,
  onImageChange,
  onError,
}: AvatarUploaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onEditToggle = () => {
    const nextIsEditing = !isEditing;
    setIsEditing(nextIsEditing);

    if (!nextIsEditing) {
      onCancelPreview();
      onFileSelect(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }

    onImageChange?.(false);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    // 파일이 선택되지 않은 경우
    if (!file) {
      onFileSelect(null);
      onCancelPreview();
      onImageChange?.(false);
      return;
    }

    // 파일 확장자 검증
    if (!validateFileExtension(file.name)) {
      const message = `지원하지 않는 파일 형식입니다. (${ALLOWED_EXTENSIONS.join(", ")} 파일만 업로드 가능)`;
      onError?.(message);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    // 파일 타입 검증
    if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
      const message =
        "지원하지 않는 파일 형식입니다. (JPG, PNG, GIF 파일만 업로드 가능)";
      onError?.(message);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      const message = `파일 크기가 너무 큽니다. (최대 ${formatFileSize(MAX_FILE_SIZE)}, 현재 파일: ${formatFileSize(file.size)})`;
      onError?.(message);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    // 모든 검증 통과 시 파일 처리
    onFileSelect(file);
    const url = URL.createObjectURL(file);
    onPreview(url);
    onImageChange?.(true);
  };

  return (
    <div className="text-xs">
      {!isEditing ? (
        <button
          type="button"
          onClick={onEditToggle}
          className="rounded-xl bg-gray-800 px-3 py-2 text-white transition-colors hover:bg-gray-700"
        >
          프로필 이미지 수정
        </button>
      ) : (
        <div className="space-y-3">
          <div className="space-x-2">
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_EXTENSIONS.join(",")}
              className="hidden"
              onChange={onFileChange}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-xl bg-gray-200 px-3 py-2 transition-colors hover:bg-gray-300"
            >
              이미지 선택
            </button>

            <button
              type="button"
              onClick={onEditToggle}
              className="rounded-xl border border-black px-3 py-2 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
            >
              취소
            </button>
          </div>

          {/* 파일 제한 안내 */}
          <div className="space-y-1 text-xs text-gray-500">
            <p>• 지원 형식: JPG, PNG, GIF</p>
            <p>• 최대 크기: {formatFileSize(MAX_FILE_SIZE)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
