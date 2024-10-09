"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { isAuth } from "firebase-config";

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

type CurrentPasswordFormData = z.infer<typeof currentPasswordSchema>;
type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

type User = {
  email: string;
};

export default function ChangePassword({ user }: { user: User }) {
  const [isVerified, setIsVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {
    register: registerCurrent,
    handleSubmit: handleSubmitCurrent,
    formState: { errors: errorsCurrent },
  } = useForm<CurrentPasswordFormData>({
    resolver: zodResolver(currentPasswordSchema),
  });
  const {
    register: registerNew,
    handleSubmit: handleSubmitNew,
    formState: { errors: errorsNew },
  } = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
  });

  const verifyCurrentPasswordHandler = async (
    data: CurrentPasswordFormData,
  ) => {
    try {
      await signInWithEmailAndPassword(
        isAuth,
        user.email,
        data.currentPassword,
      );
      setIsVerified(true);
    } catch (error) {
      console.error("현재 비밀번호 확인 실패:", error);
    }
  };

  const changePasswordHanlder = async ({
    newPassword,
  }: {
    newPassword: string;
  }) => {
    if (!isAuth.currentUser) {
      throw new Error("사용자가 로그인되어 있지 않습니다.");
    }

    try {
      await updatePassword(isAuth.currentUser, newPassword);
      console.log("비밀번호가 성공적으로 변경되었습니다.");
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
      throw error;
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
    <>
      <div
        className="group relative inline-block cursor-pointer py-4 text-end text-sm after:absolute after:bottom-3 after:right-0 after:h-0.5 after:w-0 after:bg-black after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
        onClick={() => setIsEditing((prev) => !prev)}
      >
        {!isEditing ? "비밀번호를 수정하고 싶나요?" : "취소"}
      </div>
      <div className="group relative mb-12 inline-block w-full">
        <div
          className={`relative z-10 rounded-xl border-2 border-black bg-white p-4 transition-all duration-300 ${
            isEditing
              ? "pointer-events-auto translate-y-0 opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1"
              : "pointer-events-none translate-y-5 opacity-0"
          }`}
        >
          <div>
            <form onSubmit={handleSubmitCurrent(verifyCurrentPasswordHandler)}>
              <label
                htmlFor="current-password"
                className="mb-1 block text-xs font-medium text-gray-700"
              >
                현재 비밀번호
              </label>
              <input
                id="current-password"
                {...registerCurrent("currentPassword")}
                type="password"
                className={`w-full border-b-2 border-black bg-transparent pb-2 text-xl outline-none ${isVerified ? "bg-gray-300" : ""}`}
                placeholder={
                  !isVerified
                    ? "현재 비밀번호를 입력하세요."
                    : "확인되었습니다."
                }
                autoComplete="off"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="whitespace-nowrap pt-2 text-sm"
                >
                  확인
                </button>
              </div>
              {errorsCurrent.currentPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errorsCurrent.currentPassword.message}
                </p>
              )}
            </form>
          </div>

          <div className="">
            <form onSubmit={handleSubmitNew(changePasswordHanlder)}>
              <label
                htmlFor="new-password"
                className="mb-1 block text-xs font-medium text-gray-700"
              >
                새로운 비밀번호
              </label>
              <input
                id="new-password"
                {...registerNew("newPassword")}
                type="password"
                className={`w-full border-b-2 border-black bg-transparent pb-2 text-xl outline-none ${!isVerified ? "bg-gray-600" : ""}`}
                placeholder={`${!isVerified ? "현재 비밀번호를 먼저 확인하세요." : "새로운 비밀번호를 입력하세요."}`}
                disabled={!isVerified}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="whitespace-nowrap pt-2 text-sm"
                >
                  수정
                </button>
              </div>
              {errorsNew.newPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errorsNew.newPassword.message}
                </p>
              )}
            </form>
          </div>
        </div>
        <div
          className={`absolute left-1 top-1 -z-10 h-full w-full rounded-xl border-2 border-black bg-black transition-all duration-300 ${
            isEditing
              ? "opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:bg-gray-200"
              : "opacity-0"
          }`}
        ></div>
      </div>
    </>
  );
}
