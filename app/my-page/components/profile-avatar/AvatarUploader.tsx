"use client";

import { useState, ChangeEvent, useRef } from "react";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db, isAuth } from "firebase-config";

interface AvatarUploaderProps {
  previewSrc?: string | null;
  onPreview: (url: string | null) => void;
  onCancelPreview: () => void;
}

export default function AvatarUploader({
  previewSrc,
  onPreview,
  onCancelPreview,
}: AvatarUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onEditToggle = () => {
    setIsEditing((prev) => !prev);
    setFile(null);
    onCancelPreview();
    if (inputRef.current) {
      inputRef.current.value = ""; // 파일 선택 초기화
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      onPreview(url);
    } else {
      onCancelPreview();
    }
  };

  const onUpload = async () => {
    if (!file || !isAuth.currentUser) return;
    setUploading(true);

    // 1) Presigned URL 발급
    const res = await fetch("/api/s3/get-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        userId: isAuth.currentUser.uid,
      }),
    });
    const { url, key } = await res.json();

    // 2) S3에 직접 PUT
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    // 3) 프로필에 key 저장 (Firebase Auth & Firestore 예시)
    await updateProfile(isAuth.currentUser, { photoURL: key });
    const userRef = doc(db, "users", isAuth.currentUser.uid);
    await updateDoc(userRef, { photoKey: key });

    setUploading(false);
    onEditToggle();
    alert("프로필 이미지 업로드 완료!");
  };

  return (
    <div className="text-xs">
      {!isEditing ? (
        <button
          type="button"
          onClick={onEditToggle}
          className="rounded-xl bg-black px-3 py-2 text-white"
        >
          프로필 이미지 수정
        </button>
      ) : (
        <div className="space-x-2">
          {/* 파일 선택 버튼 */}
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

          {/* 3. 업로드 버튼 */}
          {previewSrc && (
            <button
              type="button"
              onClick={onUpload}
              disabled={uploading}
              className="rounded-xl bg-black px-3 py-2 text-white disabled:opacity-50"
            >
              {uploading ? "업로드 중…" : "업로드"}
            </button>
          )}

          {/* 4. 취소 버튼 */}
          <button
            type="button"
            onClick={onEditToggle}
            disabled={uploading}
            className="rounded-xl border border-black px-3 py-2 hover:border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}
