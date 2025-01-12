import { useCallback, useEffect, useState } from "react";
import { db, isAuth } from "firebase-config";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import ChangePassword from "app/my-page/change-password";
import { useError } from "store/context/error-context";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { onUpdateUserDisplayName } from "store/redux-toolkit/slice/userSlice";
import { BackAnimation } from "app/ui/back-animation";

interface UserDoc {
  displayName: string;
  biography: string;
  updatedAt: Timestamp | FieldValue;
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
      } catch (error) {
        if (error instanceof Error) {
          window.alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
        } else {
          const { title, message } = firebaseErrorHandler(error);
          isShowError(title, message);
        }
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

  const onSubmitHandler = useCallback(
    async (data: FormData) => {
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
        // 1. 닉네임 중복 체크(닉네임이 변경된 경우에만)
        if (dirtyFields.displayName) {
          const nicknameQuery = query(
            collection(db, "users"),
            where("displayName", "==", data.displayName),
            limit(1),
          );
          const nicknameSnapshot = await getDocs(nicknameQuery);

          if (!nicknameSnapshot.empty) {
            isShowError("알림", "이미 사용 중인 닉네임입니다.");
            return;
          }
        }

        const userRef = doc(db, "users", serializedUser.uid);
        // 2. 사용자 정보 수정
        await runTransaction(db, async (transaction) => {
          let updateData: Partial<UserDoc> = {
            updatedAt: serverTimestamp(),
          };

          if (dirtyFields.displayName || dirtyFields.biography) {
            updateData = {
              ...updateData,
              displayName: data.displayName,
              biography: data.biography,
            };
          }

          // Firestore 업데이트
          transaction.update(userRef, updateData);

          // Auth 업데이트 (displayName이 변경된 경우에만)
          if (dirtyFields.displayName && isAuth.currentUser) {
            await updateProfile(isAuth.currentUser, {
              displayName: data.displayName,
            });
            dispatch(
              onUpdateUserDisplayName({ displayName: data.displayName }),
            );
          }

          // userDoc 상태 업데이트
          setUserDoc((prev) => ({
            ...prev!,
            ...updateData,
          }));
        });

        setIsEditing(false);
        isShowSuccess("성공", "프로필 정보가 업데이트되었습니다.");
      } catch (error) {
        const { title, message } = firebaseErrorHandler(error);
        isShowError(title, message);
      } finally {
        setIsLoading(false);
      }
    },
    [dirtyFields, isShowError, isShowSuccess, serializedUser, dispatch],
  );

  const editingToggleHandler = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      reset();
    }
  }, [isEditing, reset]);

  return (
    <main className="w-full md:ml-8">
      <section className="group relative">
        <div className="rounded-xl border-2 border-black bg-white px-8 pb-10 pt-6 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="flex items-center border-b-2 border-black pb-1">
              <h1 className="w-full text-2xl font-bold">PROFILE</h1>
              {isEditing ? (
                <>
                  <div
                    onClick={editingToggleHandler}
                    className={`cursor-pointer whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 ${!isLoading ? "hover:bg-black hover:text-white" : "cursor-not-allowed opacity-50"}`}
                  >
                    취소
                  </div>
                  <div className="whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 hover:bg-black hover:text-white">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      {isLoading ? "저장 중..." : "저장"}
                    </button>
                  </div>
                </>
              ) : (
                <div
                  onClick={editingToggleHandler}
                  className={`cursor-pointer whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 ${!isLoading ? "hover:bg-black hover:text-white" : "cursor-not-allowed opacity-50"}`}
                >
                  수정
                </div>
              )}
            </div>
            <div className="border-b border-black pb-2 pt-4">
              <h2 className="text-xs font-bold">닉네임</h2>
              <div className="w-full">
                {isEditing ? (
                  <>
                    <input
                      {...register("displayName")}
                      type="text"
                      className={`w-full bg-transparent text-lg text-gray-600 ${
                        isLoading ? "cursor-not-allowed opacity-50" : ""
                      }`}
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
              <div className="w-full">
                {isLoading ? (
                  <div className="w-full text-sm text-gray-400">
                    바이오를 불러오는 중
                  </div>
                ) : isEditing ? (
                  <>
                    <input
                      {...register("biography")}
                      type="text"
                      className={`w-full bg-transparent text-lg text-gray-600 ${
                        isLoading ? "cursor-not-allowed opacity-50" : ""
                      }`}
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
            <div className="mr-4 w-full">{serializedUser?.email}</div>
          </div>
        </div>
        <BackAnimation />
      </section>

      {/* Change Password */}
      {userDoc?.provider === "email" && <ChangePassword />}
    </main>
  );
}
