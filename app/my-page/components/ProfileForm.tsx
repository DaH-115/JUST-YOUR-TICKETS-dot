"use client";

import ChangePassword from "app/my-page/components/ChangePassword";
import ProfileField from "app/my-page/components/ProfileField";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAlert } from "store/context/alertContext";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { useUserProfile } from "app/my-page/hooks/useUserProfile";
import { useNicknameValidation } from "app/my-page/hooks/useNicknameValidation";
import { useProfileUpdate } from "app/my-page/hooks/useProfileUpdate";
import { z } from "zod";
import { firebaseErrorHandler } from "app/utils/firebaseError";

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

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const serializedUser = useAppSelector((state) => state.user.user);
  const { showErrorHanlder, showSuccessHanlder } = useAlert();

  const { userDoc, isLoading, setUserDoc } = useUserProfile(
    serializedUser?.uid,
  );
  const { checkNicknameDuplicate } = useNicknameValidation();
  const { updateUserProfile } = useProfileUpdate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      biography: "",
    },
  });

  // 폼 초기값 설정
  useEffect(() => {
    if (userDoc) {
      reset({
        displayName: userDoc.displayName || "",
        biography: userDoc.biography || "",
      });
    }
  }, [userDoc, reset]);

  // 폼 제출 핸들러
  const onSubmit = useCallback(
    async (data: ProfileFormData) => {
      if (!serializedUser) {
        showErrorHanlder("오류", "로그인이 필요합니다.");
        return;
      }

      if (Object.keys(dirtyFields).length === 0) {
        setIsEditing(false);
        return;
      }

      try {
        // 닉네임 중복 체크
        if (dirtyFields.displayName) {
          const isDuplicate = await checkNicknameDuplicate(data.displayName);
          if (isDuplicate) {
            showErrorHanlder("알림", "이미 사용 중인 닉네임입니다.");
            return;
          }
        }

        await updateUserProfile({
          uid: serializedUser.uid,
          data,
          dirtyFields,
          setUserDoc,
        });

        setIsEditing(false);
        showSuccessHanlder("성공", "프로필 정보가 업데이트되었습니다.");
      } catch (error) {
        if (error instanceof Error) {
          showErrorHanlder("오류", error.message);
        } else {
          const { title, message } = firebaseErrorHandler(error);
          showErrorHanlder(title, message);
        }
      }
    },
    [
      dirtyFields,
      serializedUser,
      checkNicknameDuplicate,
      updateUserProfile,
      setUserDoc,
      showErrorHanlder,
      showSuccessHanlder,
    ],
  );

  const editToggleHanlder = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      reset();
    }
  }, [isEditing, reset]);

  return (
    <main className="w-full">
      <section className="group mb-6">
        <div className="rounded-xl border-2 border-gray-200 bg-white p-8 pt-6 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center">
              <h1 className="w-full text-xl font-bold">MY PROFILE</h1>
              {isEditing ? (
                <>
                  <div
                    onClick={editToggleHanlder}
                    className={`cursor-pointer whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 ${
                      !isLoading
                        ? "hover:bg-black hover:text-white"
                        : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    취소
                  </div>
                  <div className="whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 hover:bg-black hover:text-white">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`${
                        isLoading ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      {isLoading ? "저장 중..." : "저장"}
                    </button>
                  </div>
                </>
              ) : (
                <div
                  onClick={editToggleHanlder}
                  className={`cursor-pointer whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 ${
                    !isLoading
                      ? "hover:bg-black hover:text-white"
                      : "cursor-not-allowed opacity-50"
                  }`}
                >
                  수정
                </div>
              )}
            </div>

            <ProfileField
              label="닉네임"
              id="displayName"
              value={serializedUser?.displayName || undefined}
              isEditing={isEditing}
              isLoading={isLoading}
              register={register("displayName")}
              error={errors.displayName}
              placeholder="Guest"
            />

            <ProfileField
              label="바이오"
              id="biography"
              value={userDoc?.biography}
              isEditing={isEditing}
              isLoading={isLoading}
              register={register("biography")}
              error={errors.biography}
              placeholder="바이오를 입력해 주세요."
            />
          </form>

          <div className="w-full border-b border-black py-2">
            <h2 className="text-xs font-bold">이메일</h2>
            <div className="w-full">{serializedUser?.email}</div>
          </div>
        </div>
      </section>

      {userDoc?.provider === "email" && <ChangePassword />}
    </main>
  );
}
