"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "app/components/ui/forms/InputField";
import { useChangePassword } from "app/my-page/hooks/useChangePassword";

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
  const {
    register: regCurrent,
    handleSubmit: submitCurrent,
    formState: { errors: errCurrent, touchedFields: touchedCurrent },
    reset: resetCurrentPassword, // 현재 비밀번호 폼 리셋 함수 추가
  } = useForm<CurrentPasswordForm>({
    resolver: zodResolver(currentPasswordSchema),
  });

  const {
    register: regNew,
    handleSubmit: submitNew,
    formState: { errors: errNew, touchedFields: touchedNew },
    reset: resetNewPassword, // 새 비밀번호 폼 리셋 함수 추가
  } = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
  });

  const { isVerifying, isUpdating, onVerifyCurrent, onChangePassword } =
    useChangePassword();

  // 새 비밀번호 변경 핸들러: 성공 시 입력값 리셋
  const handleChangePassword = async (data: NewPasswordForm) => {
    try {
      await onChangePassword(data);
      // 성공 시에만 폼 리셋
      resetCurrentPassword();
      resetNewPassword();
    } catch (error) {
      // 에러 발생 시 폼은 그대로 유지하여 사용자가 수정할 수 있도록 함
      console.error("비밀번호 변경 실패:", error);
    }
  };

  return (
    <section className="relative rounded-xl bg-white">
      <h2 className="mb-4 text-lg font-bold">비밀번호 변경</h2>

      {/* 현재 비밀번호 확인 폼 - 항상 표시 */}
      <div className="mb-6">
        <h3 className="sr-only">현재 비밀번호 확인</h3>
        <div
          className="mb-2"
          onKeyDown={(e) => {
            // 엔터키 입력 시, 현재 비밀번호 확인 실행
            if (e.key === "Enter" && !isVerifying) {
              e.preventDefault();
              submitCurrent(onVerifyCurrent)();
            }
          }}
        >
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
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={submitCurrent(onVerifyCurrent)}
            disabled={isVerifying}
            className={`mt-2 flex-shrink-0 rounded-2xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
              isVerifying
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            {isVerifying ? "확인 중..." : "비밀번호 확인"}
          </button>
        </div>
      </div>

      {/* 새 비밀번호 변경 폼 - 항상 표시 */}
      <div>
        <h3 className="sr-only">새 비밀번호 변경</h3>
        <div
          className="mb-2"
          onKeyDown={(e) => {
            // 엔터키 입력 시, 새 비밀번호 변경 실행
            if (e.key === "Enter" && !isUpdating) {
              e.preventDefault();
              submitNew(handleChangePassword)();
            }
          }}
        >
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
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={submitNew(handleChangePassword)}
            disabled={isUpdating}
            className={`mt-2 flex-shrink-0 rounded-2xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
              isUpdating
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            {isUpdating ? "변경 중..." : "비밀번호 변경"}
          </button>
        </div>
      </div>
    </section>
  );
}
