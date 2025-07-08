"use client";

import { useState, ChangeEvent, useRef } from "react";

interface AvatarUploaderProps {
  previewSrc: string | null;
  onPreview: (url: string | null) => void;
  onCancelPreview: () => void;
  onFileSelect: (file: File | null) => void;
  onImageChange?: (hasChanged: boolean) => void;
}

export default function AvatarUploader({
  previewSrc,
  onPreview,
  onCancelPreview,
  onFileSelect,
  onImageChange,
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
    onFileSelect(file);

    if (file) {
      const url = URL.createObjectURL(file);
      onPreview(url);
      onImageChange?.(true);
    } else {
      onCancelPreview();
      onImageChange?.(false);
    }
  };

  return (
    <div className="text-xs">
      {!isEditing ? (
        <button
          type="button"
          onClick={onEditToggle}
          className="rounded-xl bg-gray-800 px-3 py-2 text-white"
        >
          프로필 이미지 수정
        </button>
      ) : (
        <div className="space-x-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl bg-gray-200 px-3 py-2 hover:bg-gray-300"
          >
            이미지 선택
          </button>

          <button
            type="button"
            onClick={onEditToggle}
            className="rounded-xl border border-black px-3 py-2 hover:border-red-600 hover:bg-red-600 hover:text-white"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}
