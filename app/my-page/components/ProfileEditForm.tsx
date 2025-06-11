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
  updateUserDisplayName,
  updateUserMetaData,
} from "store/redux-toolkit/slice/userSlice";
import ProfileAvatar from "app/my-page/components/profile-avatar/ProfileAvatar";
import AvatarUploader from "app/my-page/components/profile-avatar/AvatarUploader";

export const profileSchema = z.object({
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

export type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEditForm() {
  const router = useRouter();
  const userAuth = useAppSelector((state) => state.userData.auth);
  const userMetaData = useAppSelector((state) => state.userData.metaData);
  const { showErrorHandler, showSuccessHandler } = useAlert();
  const currentUser = isAuth.currentUser;
  const dispatch = useAppDispatch();

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      biography: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { dirtyFields, isSubmitting },
  } = methods;

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const hasDirty = Object.keys(dirtyFields).length > 0 || hasImageChanged;

  useEffect(() => {
    if (userAuth && userMetaData) {
      reset({
        displayName: userAuth.displayName || "",
        biography: userMetaData?.biography || "",
      });
    }
  }, [reset, userAuth, userMetaData]);

  const onSubmit = useCallback(
    async (data: ProfileFormData) => {
      if (!currentUser || !userAuth) {
        showErrorHandler("오류", "로그인이 필요합니다.");
        return;
      }

      try {
        // 1) displayName 변경 처리
        if (data.displayName !== userAuth.displayName) {
          await dispatch(updateUserDisplayName(data.displayName)).unwrap();
        }

        // 2) biography 변경 처리
        if (data.biography !== userMetaData?.biography) {
          await dispatch(
            updateUserMetaData({
              uid: userAuth.uid,
              data: { biography: data.biography || "" },
            }),
          ).unwrap();
        }

        showSuccessHandler("성공", "프로필 정보가 업데이트되었습니다.");
        setHasImageChanged(false); // 폼 제출 완료 후 이미지 변경 상태 초기화
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
      userAuth,
      userMetaData,
      dispatch,
      showErrorHandler,
      showSuccessHandler,
      router,
    ],
  );

  const handleCancel = () => {
    if (hasDirty) {
      if (confirm("변경사항이 저장되지 않습니다. 정말 나가시겠습니까?")) {
        setHasImageChanged(false);
        setPreviewSrc(null);
        router.push("/my-page");
      }
    } else {
      router.push("/my-page");
    }
  };

  return (
    <main className="flex min-h-full w-full flex-col pl-0 md:w-3/4 md:pl-4">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
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
              ? "bg-blue-500 text-white hover:bg-blue-600"
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
                onImageChange={(hasChanged) => setHasImageChanged(hasChanged)}
              />
            </div>
          </div>

          {/* 기본 정보 섹션 */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">기본 정보</h2>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  이메일
                </label>
                <div className="rounded-lg bg-gray-50 px-3 py-2 text-gray-500">
                  {userAuth?.email}
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  이메일은 변경할 수 없습니다.
                </p>
              </div>

              <NicknameInput
                originalValue={userAuth?.displayName}
                isEditing={true}
              />

              <BioInput
                isEditing={true}
                originalValue={userMetaData?.biography}
              />
            </div>
          </div>

          {/* 비밀번호 변경 섹션 */}
          {userMetaData?.provider === "email" && (
            <div className="mb-8">
              <ChangePassword />
            </div>
          )}
        </form>
      </FormProvider>
    </main>
  );
}
