"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { isAuth } from "firebase-config";
import useFirebaseUser from "hooks/useFirebaseUser";
import { firebaseErrorHandler } from "app/my-page/utils/firebase-error";
import { useError } from "store/error-context";

const currentPasswordSchema = z.object({
  currentPassword: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
});

const newPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_])/,
      "비밀번호는 영문자, 숫자, 특수문자를 하나 이상 포함해야 합니다.",
    ),
});

type CurrentPasswordSchema = z.infer<typeof currentPasswordSchema>;
type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

export default function ChangePassword() {
  const [isVerified, setIsVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { serializedUser, currentUser } = useFirebaseUser();
  const { isShowError, isShowSuccess } = useError();

  const {
    register: registerCurrent,
    handleSubmit: handleSubmitCurrent,
    formState: { errors: errorsCurrent },
  } = useForm<CurrentPasswordSchema>({
    resolver: zodResolver(currentPasswordSchema),
  });

  const {
    register: registerNew,
    handleSubmit: handleSubmitNew,
    formState: { errors: errorsNew },
  } = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
  });

  const verifyCurrentPasswordHandler = async (data: CurrentPasswordSchema) => {
    if (!serializedUser?.email) {
      isShowError("오류", "사용자의 이메일을 찾을 수 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(
        isAuth,
        serializedUser.email,
        data.currentPassword,
      );
      setIsVerified(true);
    } catch (error: any) {
      const { title, message } = firebaseErrorHandler(error);
      isShowError(title, message);
    } finally {
      setIsLoading(false);
    }
  };

  const changePasswordHanlder = async ({
    newPassword,
  }: {
    newPassword: string;
  }) => {
    if (!currentUser) {
      isShowError("인증 오류", "사용자가 로그인되어 있지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(currentUser, newPassword);
      setIsVerified(false);
      setIsEditing(false);
      isShowSuccess("비밀번호 변경", "비밀번호가 성공적으로 변경되었습니다.");
    } catch (error: any) {
      const { title, message } = firebaseErrorHandler(error);
      isShowError(title, message);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBttomHandler = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    if (isEditing) {
      scrollToBttomHandler();
    }
  }, [isEditing]);

  return (
    <div className="relative">
      <div
        className="group relative cursor-pointer py-4 text-end text-xs text-gray-500"
        onClick={() => setIsEditing((prev) => !prev)}
      >
        {!isEditing ? "비밀번호 변경" : "취소"}
      </div>
      <section
        className={`transition-all duration-300 ease-in-out ${
          isEditing ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="group relative mb-12 w-full">
          <div
            className={`relative z-10 rounded-xl border-2 border-black bg-white p-4 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1`}
          >
            <form onSubmit={handleSubmitCurrent(verifyCurrentPasswordHandler)}>
              <label
                htmlFor="current-password"
                className="mb-1 block text-xs font-bold text-gray-700"
              >
                현재 비밀번호
              </label>
              <input
                id="current-password"
                {...registerCurrent("currentPassword")}
                type="password"
                className={`w-full border-b border-black bg-transparent pb-2 ${isVerified ? "bg-gray-300" : "border-b-2"} ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                placeholder={
                  !isVerified
                    ? "현재 비밀번호를 입력하세요."
                    : "확인되었습니다."
                }
                autoComplete="off"
                disabled={isLoading || isVerified}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`mt-1 whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 ${
                    isLoading || isVerified
                      ? "cursor-not-allowed bg-gray-300"
                      : "hover:bg-black hover:text-white"
                  }`}
                  disabled={isLoading || isVerified}
                >
                  {isLoading ? "확인 중..." : "확인"}
                </button>
              </div>
              {errorsCurrent.currentPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errorsCurrent.currentPassword.message}
                </p>
              )}
            </form>
            <form onSubmit={handleSubmitNew(changePasswordHanlder)}>
              <label
                htmlFor="new-password"
                className="mb-1 block text-xs font-bold text-gray-700"
              >
                새로운 비밀번호
              </label>
              <input
                id="new-password"
                {...registerNew("newPassword")}
                type="password"
                className={`w-full border-b border-black bg-transparent pb-2 ${!isVerified ? "bg-slate-200" : "border-b-2"} ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                placeholder={`${!isVerified ? "현재 비밀번호를 먼저 확인하세요." : "새로운 비밀번호를 입력하세요."}`}
                disabled={!isVerified || isLoading}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-1 whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 hover:bg-black hover:text-white"
                  disabled={!isVerified || isLoading}
                >
                  {isLoading ? "변경 중..." : "수정"}
                </button>
              </div>
              {errorsNew.newPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errorsNew.newPassword.message}
                </p>
              )}
            </form>
          </div>
          <span
            className={`absolute left-1 top-1 -z-10 h-full w-full rounded-xl border-2 border-black bg-black transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:bg-gray-200`}
          />
        </div>
      </section>
    </div>
  );
}
