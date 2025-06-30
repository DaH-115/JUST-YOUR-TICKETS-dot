"use client";

import { useState, ChangeEvent, useRef } from "react";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db, isAuth } from "firebase-config";
import { useAppDispatch } from "store/redux-toolkit/hooks";
import { updatePhotoURL } from "store/redux-toolkit/slice/userSlice";

interface AvatarUploaderProps {
  previewSrc: string | null;
  onPreview: (url: string | null) => void;
  onCancelPreview: () => void;
  onImageChange?: (hasChanged: boolean) => void;
}

export default function AvatarUploader({
  previewSrc,
  onPreview,
  onCancelPreview,
  onImageChange,
}: AvatarUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const onEditToggle = () => {
    setIsEditing((prev) => !prev);
    setFile(null);
    onCancelPreview();
    onImageChange?.(false); // 편집 취소 시 변경 상태 초기화
    if (inputRef.current) {
      inputRef.current.value = ""; // 파일 선택 초기화
    }
  };

  const onUploadComplete = () => {
    setIsEditing(false);
    setFile(null);
    onCancelPreview();
    // 업로드 완료 후에는 이미지 변경 상태를 초기화하지 않음
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
      // 파일 선택 시점에서는 아직 업로드되지 않았으므로 변경 상태를 true로 하지 않음
    } else {
      onCancelPreview();
      onImageChange?.(false); // 이미지 선택 취소 시 변경 상태 false
    }
  };

  const onUploadHandler = async () => {
    if (!file || !isAuth.currentUser) return;
    setUploading(true);

    try {
      // 1) Presigned URL 발급
      const res = await fetch("/api/s3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          userId: isAuth.currentUser?.uid,
        }),
      });
      const { url, key } = await res.json();

      // 2) S3에 직접 PUT
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // 3) 프로필에 key 저장 (Firebase Auth & Firestore)
      await updateProfile(isAuth.currentUser, { photoURL: key });
      const userRef = doc(db, "users", isAuth.currentUser.uid);
      await updateDoc(userRef, { photoKey: key });

      // 4) Redux 상태 업데이트
      dispatch(updatePhotoURL(key));

      // 5) Firebase Auth 사용자 정보 새로고침
      await isAuth.currentUser.reload();

      setUploading(false);
      alert("프로필 이미지 업로드 완료");
      onImageChange?.(true); // 업로드 완료 시 변경 상태 true로 설정
      onUploadComplete();
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      setUploading(false);
      alert("프로필 이미지 업로드에 실패했습니다.");
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
              onClick={onUploadHandler}
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
