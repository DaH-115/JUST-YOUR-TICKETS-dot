"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import { useAlert } from "store/context/alertContext";

import EditableSection from "app/my-page/components/EditableSection";
import NicknameInput from "app/my-page/components/NicknameInput";
import BioInput from "app/my-page/components/BioInput";
import ChangePassword from "app/my-page/components/ChangePassword";
import { isAuth } from "firebase-config";
import {
  updateUserDisplayName,
  updateUserMetaData,
} from "store/redux-toolkit/slice/userSlice";
import ProfileAvatar from "app/my-page/components/profile-avatar/ProfileAvatar";

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
  const userAuth = useAppSelector((state) => state.userData.auth);
  const userMetaData = useAppSelector((state) => state.userData.metaData);
  const { showErrorHanlder, showSuccessHanlder } = useAlert();
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
    formState: { dirtyFields },
  } = methods;

  const [isEditing, setIsEditing] = useState(false);
  const hasDirty = Object.keys(dirtyFields).length > 0;

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
        showErrorHanlder("오류", "로그인이 필요합니다.");
        return;
      }

      // 1) displayName 변경 처리(Thunk 재사용)
      if (data.displayName !== userAuth.displayName) {
        try {
          // updateUserDisplayName thunk 호출
          await dispatch(updateUserDisplayName(data.displayName)).unwrap();
        } catch (error: any) {
          // 닉네임 중복 등 에러 처리
          showErrorHanlder("오류", error.message);
          return;
        }
      }

      // 2) biography 변경 처리
      if (data.biography !== userMetaData?.biography) {
        try {
          await dispatch(
            updateUserMetaData({
              uid: userAuth.uid,
              data: { biography: data.biography || "" },
            }),
          ).unwrap();
        } catch (err: any) {
          showErrorHanlder("오류", err);
          return;
        }
      }

      // 3) 최신화된 메타데이터를 다시 불러오거나 리셋
      reset(data);
      showSuccessHanlder("성공", "프로필 정보가 업데이트되었습니다.");
    },
    [
      currentUser,
      userAuth,
      userMetaData,
      dispatch,
      reset,
      showErrorHanlder,
      showSuccessHanlder,
    ],
  );

  return (
    <main className="mx-auto w-full">
      <div className="mb-4 rounded-xl border-2 border-gray-200 bg-white p-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <section className="mb-8 text-center">
              <div className="mb-4">
                <ProfileAvatar />
              </div>
              <h1 className="text-2xl font-bold">
                {userAuth?.displayName || "사용자"}
              </h1>
              <p className="text-sm text-gray-400">{userAuth?.email}</p>
            </section>
            <EditableSection
              title="Profile information"
              isEditing={isEditing}
              onEditToggle={() => {
                if (isEditing) {
                  reset({
                    displayName: userAuth?.displayName || "",
                    biography: userMetaData?.biography || "",
                  });
                }
                setIsEditing((prev) => !prev);
              }}
              isSaveDisabled={!hasDirty}
            >
              <NicknameInput
                originalValue={userAuth?.displayName}
                isEditing={isEditing}
              />
              <BioInput
                isEditing={isEditing}
                originalValue={userMetaData?.biography}
              />
            </EditableSection>
          </form>
        </FormProvider>
      </div>
      {userMetaData?.provider === "email" && (
        <section>
          <ChangePassword />
        </section>
      )}
      <div className="block space-y-2 md:hidden">
        <div className="text-white">{"My Ticket List >"}</div>
        <div className="text-white">{"Liked Ticket List >"}</div>
        <div className="text-white">{"Bookmarked Ticket List >"}</div>
      </div>
    </main>
  );
}
