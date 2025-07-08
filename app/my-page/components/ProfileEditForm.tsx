"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import { useAlert } from "store/context/alertContext";

import { FaArrowLeft, FaCheck } from "react-icons/fa";
import NicknameInput from "app/my-page/components/NicknameInput";
import BioInput from "app/my-page/components/BioInput";
import ChangePassword from "app/my-page/components/ChangePassword";
import { isAuth } from "firebase-config";
import {
  updateUserProfile,
  selectUser,
} from "store/redux-toolkit/slice/userSlice";
import ProfileAvatar from "app/my-page/components/profile-avatar/ProfileAvatar";
import AvatarUploader from "app/my-page/components/profile-avatar/AvatarUploader";

const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(20, "이름은 20자를 초과할 수 없습니다")
    .regex(/^[가-힣a-zA-Z0-9\s_]+$/, "이름에 특수문자를 사용할 수 없습니다"),
  biography: z
    .string()
    .max(100, "바이오는 100자를 초과할 수 없습니다")
    .optional()
    .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEditForm() {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const currentUser = isAuth.currentUser;
  const { showErrorHandler, showSuccessHandler } = useAlert();
  const dispatch = useAppDispatch();

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { dirtyFields, isSubmitting },
    reset,
  } = methods;

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  const hasDirty = Object.keys(dirtyFields).length > 0 || hasImageChanged;

  // 초기값 설정
  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || "",
        biography: user.biography || "",
      });
    }
  }, [reset, user]);

  // 사용자가 로그인하지 않은 경우 리다이렉트
  useEffect(() => {
    if (!currentUser || !user?.uid) {
      router.push("/login");
    }
  }, [currentUser, user, router]);

  const onSubmit = useCallback(
    async (data: ProfileFormData) => {
      if (!currentUser || !user?.uid) {
        showErrorHandler("오류", "로그인이 필요합니다.");
        return;
      }

      try {
        const updatePayload: {
          displayName?: string;
          biography?: string;
          photoKey?: string;
        } = {};

        // 변경된 필드만 업데이트 대상에 포함
        if (dirtyFields.displayName && data.displayName !== user?.displayName) {
          updatePayload.displayName = data.displayName;
        }
        if (dirtyFields.biography && data.biography !== user?.biography) {
          updatePayload.biography = data.biography;
        }

        // 이미지 업로드 처리
        if (selectedFile && hasImageChanged) {
          // S3 Presigned URL 요청
          const presignedRes = await fetch("/api/s3", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: selectedFile.name,
              contentType: selectedFile.type,
              userId: currentUser.uid,
            }),
          });

          if (!presignedRes.ok) {
            throw new Error("이미지 업로드 준비에 실패했습니다.");
          }

          const { url, key } = await presignedRes.json();

          // S3에 이미지 업로드
          const uploadRes = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": selectedFile.type },
            body: selectedFile,
          });

          if (!uploadRes.ok) {
            throw new Error("이미지 업로드에 실패했습니다.");
          }

          updatePayload.photoKey = key;
        }

        // 변경사항이 있는 경우에만 API 호출
        if (Object.keys(updatePayload).length > 0) {
          await dispatch(
            updateUserProfile({ uid: user.uid, data: updatePayload }),
          ).unwrap();

          showSuccessHandler("성공", "프로필이 업데이트되었습니다.");
        }

        // 성공 시 마이페이지로 이동
        router.push("/my-page");
      } catch (error: any) {
        showErrorHandler(
          "오류",
          error.message || "프로필 업데이트에 실패했습니다.",
        );
      }
    },
    [
      currentUser,
      user,
      dispatch,
      showErrorHandler,
      showSuccessHandler,
      router,
      dirtyFields,
      selectedFile,
      hasImageChanged,
    ],
  );

  const handleCancel = useCallback(() => {
    if (hasDirty) {
      if (confirm("변경사항이 저장되지 않습니다. 정말 나가시겠습니까?")) {
        router.push("/my-page");
      }
    } else {
      router.push("/my-page");
    }
  }, [hasDirty, router]);

  return (
    <main className="flex min-h-full w-full flex-col pl-0 md:w-3/4 md:pl-4">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-white">프로필 편집</h1>
        </div>
        <button
          type="submit"
          form="profile-edit-form"
          disabled={!hasDirty || isSubmitting}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            hasDirty && !isSubmitting
              ? "bg-accent-300 text-white hover:bg-accent-500"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
        >
          <FaCheck size={12} />
          {isSubmitting ? "저장 중..." : "완료"}
        </button>
      </div>

      <FormProvider {...methods}>
        <form id="profile-edit-form" onSubmit={handleSubmit(onSubmit)}>
          {/* 프로필 이미지 섹션 */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">프로필 사진</h2>
            <div className="flex flex-col items-center gap-4">
              <ProfileAvatar previewSrc={previewSrc} />
              <AvatarUploader
                previewSrc={previewSrc}
                onPreview={(url) => setPreviewSrc(url)}
                onCancelPreview={() => setPreviewSrc(null)}
                onFileSelect={(file) => setSelectedFile(file)}
                onImageChange={(hasChanged) => setHasImageChanged(hasChanged)}
              />
            </div>
          </div>

          {/* 기본 정보 섹션 */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">기본 정보</h2>
            <div className="space-y-6">
              {user?.email && (
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    이메일
                  </label>
                  <div className="rounded-lg bg-gray-50 px-3 py-2 text-gray-600">
                    {user.email}
                  </div>
                </div>
              )}

              <NicknameInput
                originalValue={user?.displayName}
                isEditing={true}
              />

              <BioInput isEditing={true} originalValue={user?.biography} />
            </div>
          </div>

          {/* 비밀번호 변경 섹션 */}
          {user?.provider === "email" && (
            <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
              <ChangePassword />
            </div>
          )}
        </form>
      </FormProvider>
    </main>
  );
}
