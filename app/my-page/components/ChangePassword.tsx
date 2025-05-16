"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { isAuth } from "firebase-config";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { useAlert } from "store/context/alertContext";
import { useRouter } from "next/navigation";
import InputField from "app/components/InputField";

const passwordBase = z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
  .regex(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_])/,
    "비밀번호는 영문자, 숫자, 특수문자를 하나 이상 포함해야 합니다.",
  );

const currentPasswordSchema = z.object({
  currentPassword: passwordBase,
});
const newPasswordSchema = z.object({
  newPassword: passwordBase,
});

type CurrentPasswordForm = z.infer<typeof currentPasswordSchema>;
type NewPasswordForm = z.infer<typeof newPasswordSchema>;

export default function ChangePassword() {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const currentUser = isAuth.currentUser;
  const userEmail = useAppSelector((s) => s.userData.auth?.email);
  const { showErrorHanlder, showSuccessHanlder } = useAlert();

  const {
    register: regCurrent,
    handleSubmit: submitCurrent,
    formState: { errors: errCurrent, touchedFields: touchedCurrent },
  } = useForm<CurrentPasswordForm>({
    resolver: zodResolver(currentPasswordSchema),
  });

  const {
    register: regNew,
    handleSubmit: submitNew,
    formState: { errors: errNew, touchedFields: touchedNew },
  } = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onVerifyCurrent = async (data: CurrentPasswordForm) => {
    if (!currentUser || !userEmail) {
      showErrorHanlder("오류", "사용자 정보가 올바르지 않습니다.");
      return;
    }
    setIsVerifying(true);
    try {
      const cred = EmailAuthProvider.credential(
        userEmail,
        data.currentPassword,
      );
      await reauthenticateWithCredential(currentUser, cred);
      setIsVerified(true);
      showSuccessHanlder("확인", "비밀번호가 확인되었습니다.");
    } catch (error) {
      if (error instanceof Error) {
        showErrorHanlder("오류", "현재 비밀번호가 일치하지 않습니다.");
      } else {
        const { title, message } = firebaseErrorHandler(error);
        showErrorHanlder(title, message);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const onChangePassword = async (data: NewPasswordForm) => {
    if (!currentUser) {
      showErrorHanlder("오류", "사용자가 로그인되어 있지 않습니다.");
      router.push("/login");
      return;
    }
    setIsUpdating(true);
    try {
      await updatePassword(currentUser, data.newPassword);
      setIsVerified(false);
      showSuccessHanlder("성공", "비밀번호가 성공적으로 변경되었습니다.");
    } catch (error) {
      if (error instanceof Error) {
        showErrorHanlder("오류", "비밀번호 변경에 실패했습니다.");
      } else {
        const { title, message } = firebaseErrorHandler(error);
        showErrorHanlder(title, message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="relative rounded-xl border-2 bg-white px-8 py-6 transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1">
      <h2 className="mb-2 text-xl font-bold">비밀번호 변경</h2>

      {/* 1단계: 현재 비밀번호 확인 */}
      {!isVerified && (
        <form onSubmit={submitCurrent(onVerifyCurrent)}>
          <InputField
            id="currentPassword"
            label="현재 비밀번호"
            type="password"
            placeholder="현재 비밀번호를 입력하세요."
            register={regCurrent}
            error={errCurrent.currentPassword?.message}
            touched={!!touchedCurrent.currentPassword}
            disabled={isVerifying}
            autoComplete="off"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isVerifying}
              className={`rounded-xl px-3 py-1 text-sm transition-colors duration-300 ${
                isVerifying
                  ? "cursor-not-allowed bg-gray-300"
                  : "hover:bg-black hover:text-white active:bg-black active:text-white"
              }`}
            >
              {isVerifying ? "확인 중..." : "비밀번호 확인"}
            </button>
          </div>
        </form>
      )}

      {/* 2단계: 새 비밀번호 입력 */}
      {isVerified && (
        <form onSubmit={submitNew(onChangePassword)} className="mt-6">
          <InputField
            id="newPassword"
            label="새로운 비밀번호"
            type="password"
            placeholder="새로운 비밀번호를 입력하세요."
            register={regNew}
            error={errNew.newPassword?.message}
            touched={!!touchedNew.newPassword}
            disabled={isUpdating}
            autoComplete="off"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className={`rounded-xl px-3 py-1 text-sm transition-colors duration-300 ${
                isUpdating
                  ? "cursor-not-allowed bg-gray-300"
                  : "hover:bg-black hover:text-white active:bg-black active:text-white"
              }`}
            >
              {isUpdating ? "변경 중..." : "비밀번호 변경"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
