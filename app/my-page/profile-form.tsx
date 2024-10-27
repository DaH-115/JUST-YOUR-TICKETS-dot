"use client";

import { useCallback, useEffect, useState } from "react";
import { db, isAuth } from "firebase-config";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import ChangePassword from "app/my-page/change-password";
import { useError } from "store/error-context";
import { firebaseErrorHandler } from "app/my-page/utils/firebase-error";
import { useAppDispatch, useAppSelector } from "store/hooks";
import ChangeEmail from "./change-email";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { onUpdateUserProfile } from "store/userSlice";

interface UserDoc {
  displayName: string;
  biography: string;
  updatedAt: string;
  provider: string;
}

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

type FormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [userDoc, setUserDoc] = useState<UserDoc>();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const serializedUser = useAppSelector((state) => state.user.user);
  const { isShowError, isShowSuccess } = useError();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      biography: "",
    },
  });

  useEffect(() => {
    if (!serializedUser) return;

    setIsLoading(true);
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", serializedUser.uid);

      try {
        const user = await getDoc(userDocRef);

        if (user.exists()) {
          const userDoc = user.data() as UserDoc;
          setUserDoc(userDoc);
        } else {
          isShowError("데이터 없음", "사용자 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        const { title, message } = firebaseErrorHandler(err);
        isShowError(title, message);
      } finally {
        setIsLoading(false);
      }
    };

    if (serializedUser.uid) {
      fetchUserData();
    }
  }, [serializedUser, isShowError]);

  useEffect(() => {
    if (userDoc) {
      reset({
        displayName: userDoc.displayName || "",
        biography: userDoc.biography || "",
      });
    }
  }, [userDoc, reset]);

  const onSubmitHandler = async (data: FormData) => {
    if (!serializedUser) {
      isShowError("오류", "로그인이 필요합니다.");
      return;
    }

    if (Object.keys(dirtyFields).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);

    try {
      const userRef = doc(db, "users", serializedUser.uid);

      // 1. 닉네임 중복 체크(닉네임이 변경된 경우에만)
      if (dirtyFields.displayName) {
        const nicknameQuery = query(
          collection(db, "users"),
          where("nickname", "==", data.displayName),
          limit(1),
        );
        const nicknameSnapshot = await getDocs(nicknameQuery);

        if (!nicknameSnapshot.empty) {
          isShowError("알림", "이미 사용 중인 닉네임입니다.");
          setIsLoading(false);
          return;
        }
      }

      // 2. 사용자 정보 수정
      let updateData: Partial<UserDoc> = {
        updatedAt: new Date().toISOString(),
      };

      if (dirtyFields.displayName || dirtyFields.biography) {
        updateData = {
          ...updateData,
          displayName: data.displayName,
          biography: data.biography,
        };
      }

      // 3. Firestore와 Auth 업데이트
      // 닉네임이 변경된 경우 Auth 업데이트도 추가
      if (dirtyFields.displayName) {
        const currentUser = isAuth.currentUser;

        if (currentUser) {
          await updateProfile(currentUser, {
            displayName: data.displayName,
          });
          dispatch(onUpdateUserProfile({ displayName: data.displayName }));
        }
      }

      // Firestore 업데이트
      await updateDoc(userRef, updateData);

      // 4. userDoc 상태 업데이트
      setUserDoc((prev) => (prev ? { ...prev, ...updateData } : prev));
      setIsEditing(false);
      isShowSuccess("성공", "프로필 정보가 업데이트되었습니다.");
    } catch (error) {
      const { title, message } = firebaseErrorHandler(error);
      isShowError(title, message);
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const editingToggle = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      reset();
    }
  }, [isEditing, reset]);

  return (
    <main className="flex w-full flex-col">
      <div className="group relative">
        <div className="relative rounded-xl border-2 border-black bg-white px-8 pb-10 pt-6 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="flex items-center border-b-2 border-black pb-1">
              <h1 className="w-full text-2xl font-bold">PROFILE</h1>
              {isEditing ? (
                <div className="whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 hover:bg-black hover:text-white">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {isLoading ? "저장 중..." : "저장"}
                  </button>
                </div>
              ) : (
                <div
                  onClick={editingToggle}
                  className={`cursor-pointer whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 ${!isLoading ? "hover:bg-black hover:text-white" : "cursor-not-allowed opacity-50"}`}
                >
                  수정
                </div>
              )}
            </div>
            <div className="border-b border-black pb-2 pt-4">
              <h2 className="text-xs font-bold">이름</h2>
              <div className="flex w-full items-center">
                {isEditing ? (
                  <>
                    <input
                      {...register("displayName")}
                      type="text"
                      className={`w-full bg-transparent text-lg ${
                        isLoading ? "cursor-not-allowed opacity-50" : ""
                      } ${errors.displayName ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.displayName && (
                      <span className="mt-1 text-xs text-red-500">
                        {errors.displayName.message}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="w-full text-lg">
                    {serializedUser?.displayName || "Guest"}
                  </div>
                )}
              </div>
            </div>
            <div className="border-b border-black pb-2 pt-4">
              <h2 className="text-xs font-bold">바이오</h2>
              <div className="flex w-full items-center">
                {isEditing ? (
                  <>
                    <input
                      {...register("biography")}
                      type="text"
                      className={`w-full bg-transparent text-lg ${
                        isLoading ? "cursor-not-allowed opacity-50" : ""
                      } ${errors.biography ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.biography && (
                      <span className="mt-1 text-xs text-red-500">
                        {errors.biography.message}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="w-full text-lg">
                    {userDoc?.biography || (
                      <p className="text-gray-600">바이오를 입력해 주세요.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
          <div className="w-full border-b border-black pb-2 pt-4">
            <h2 className="text-xs font-bold">이메일</h2>
            <div className="mr-4 w-full">
              {serializedUser?.email ? serializedUser?.email : <ChangeEmail />}
            </div>
          </div>
        </div>
        <span
          id="animation-part"
          className="absolute left-1 top-1 -z-10 h-full w-full rounded-xl border-2 border-black bg-black transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:bg-gray-200"
        />
      </div>

      {/* Change Password */}
      {userDoc?.provider === "email" && <ChangePassword />}
    </main>
  );
}
