"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DuplicateCheckButton from "app/components/ui/buttons/DuplicateCheckButton";
import InputField from "app/components/ui/forms/InputField";
import { useNicknameCheck } from "app/my-page/hooks/useNicknameCheck";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { isAuth } from "firebase-config";
import { useAlert } from "store/context/alertContext";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "이름은 최소 2글자 이상이어야 합니다.")
      .max(50, "이름은 50글자를 초과할 수 없습니다."),
    displayName: z
      .string()
      .min(2, "닉네임은 최소 2글자 이상이어야 합니다.")
      .max(30, "닉네임은 30글자를 초과할 수 없습니다."),
    email: z
      .string()
      .email("올바른 이메일 형식이 아닙니다.")
      .min(1, "이메일을 입력해주세요.")
      .max(100, "이메일은 100글자를 초과할 수 없습니다."),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .max(100, "비밀번호는 100글자를 초과할 수 없습니다.")
      .regex(
        /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,}$/,
        "비밀번호는 숫자, 특수문자를 하나 이상 포함해야 합니다.",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호와 확인 비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { showErrorHandler, showSuccessHandler } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, touchedFields },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const displayNameValue = watch("displayName");
  const emailValue = watch("email");

  const {
    isChecking: isCheckingName,
    isChecked: isNameChecked,
    isAvailable: isDisplayNameAvailable,
    message: displayNameMessage,
    checkNickname,
  } = useNicknameCheck({ nickname: displayNameValue });

  useEffect(() => {
    if (isNameChecked && displayNameMessage) {
      if (isDisplayNameAvailable) {
        showSuccessHandler("성공", displayNameMessage);
      } else {
        showErrorHandler("실패", displayNameMessage);
      }
    }
  }, [
    isNameChecked,
    isDisplayNameAvailable,
    displayNameMessage,
    showErrorHandler,
    showSuccessHandler,
  ]);

  // 값 변경 시 이전 중복 검사 결과 초기화
  useEffect(() => {
    setIsEmailAvailable(null);
  }, [emailValue]);

  // 이메일 중복 확인
  const checkEmail = useCallback(async () => {
    const email = getValues("email");
    if (!email) {
      showErrorHandler("알림", "이메일을 입력해주세요.");
      return;
    }
    setIsCheckingEmail(true);
    try {
      const response = await fetch("/api/auth/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "email",
          value: email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "중복 확인에 실패했습니다.");
      }

      if (result.available) {
        setIsEmailAvailable(true);
        showSuccessHandler("성공", result.message);
      } else {
        setIsEmailAvailable(false);
        showErrorHandler("실패", result.message);
      }
    } catch (error) {
      const { title, message } = firebaseErrorHandler(error);
      showErrorHandler(title, message);
      setIsEmailAvailable(false);
    } finally {
      setIsCheckingEmail(false);
    }
  }, [getValues, showErrorHandler, showSuccessHandler]);

  // 회원가입 처리
  const onSubmit = useCallback(
    async (data: SignupSchema) => {
      setIsLoading(true);
      try {
        const { displayName, email, password } = data;

        // REST API로 회원가입 처리
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName,
            email,
            password,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "회원가입에 실패했습니다.");
        }

        // 회원가입 성공 후 자동 로그인
        await signInWithEmailAndPassword(isAuth, email, password);

        showSuccessHandler("회원가입 완료", "환영합니다!", () => {
          router.replace("/");
        });
      } catch (error) {
        const { title, message } = firebaseErrorHandler(error);
        showErrorHandler(title, message);
      } finally {
        setIsLoading(false);
      }
    },
    [router, showErrorHandler, showSuccessHandler],
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-accent-900 via-black to-accent-800 px-4 py-10">
      <div className="w-full max-w-md">
        {/* 티켓 컨테이너 */}
        <div className="relative">
          {/* 티켓 메인 부분 */}
          <div className="relative rounded-3xl border-2 border-accent-300/30 bg-white p-8 shadow-2xl">
            {/* 티켓 헤더 */}
            <div className="mb-8 border-b-2 border-dashed border-accent-300/50 pb-6 text-center">
              <div className="mb-2 font-mono text-xs font-bold tracking-wider text-accent-600">
                ADMIT ONE
              </div>
              <h3 className="mb-1 text-2xl font-bold text-gray-800">
                회원가입
              </h3>
              <p className="text-sm text-gray-600">
                새로운 계정을 만들어 시작하세요
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <InputField
                  id="name"
                  label="이름"
                  type="text"
                  placeholder="이름을 입력해 주세요"
                  register={register}
                  error={errors.name?.message}
                  touched={touchedFields.name}
                  disabled={isLoading}
                  autoComplete={"name"}
                />

                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <InputField
                      id="displayName"
                      label="닉네임"
                      type="text"
                      placeholder="사용하실 닉네임을 입력해 주세요"
                      register={register}
                      error={errors.displayName?.message}
                      touched={touchedFields.displayName}
                      disabled={isLoading}
                      autoComplete={"displayName"}
                    />
                    <DuplicateCheckButton
                      onClick={checkNickname}
                      disabled={isCheckingName || !displayNameValue}
                      isChecking={isCheckingName}
                    />
                  </div>
                </div>

                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <InputField
                      id="email"
                      label="이메일"
                      type="email"
                      placeholder="이메일을 입력해 주세요"
                      register={register}
                      error={errors.email?.message}
                      touched={touchedFields.email}
                      disabled={isLoading}
                      autoComplete={"email"}
                    />
                    {isEmailAvailable !== null && (
                      <p
                        className={`mt-1 text-xs ${
                          isEmailAvailable ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isEmailAvailable
                          ? "사용 가능한 이메일입니다."
                          : "이미 사용 중인 이메일입니다."}
                      </p>
                    )}
                    <DuplicateCheckButton
                      onClick={checkEmail}
                      disabled={isCheckingEmail || !emailValue}
                      isChecking={isCheckingEmail}
                    />
                  </div>
                </div>

                <InputField
                  id="password"
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력해 주세요"
                  register={register}
                  error={errors.password?.message}
                  touched={touchedFields.password}
                  disabled={isLoading}
                  autoComplete={"password"}
                />

                <InputField
                  id="confirmPassword"
                  label="비밀번호 확인"
                  type="password"
                  placeholder="비밀번호를 한 번 더 입력해 주세요"
                  register={register}
                  error={errors.confirmPassword?.message}
                  touched={touchedFields.confirmPassword}
                  disabled={isLoading}
                  autoComplete={"confirmPassword"}
                />
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  isDisplayNameAvailable !== true ||
                  isEmailAvailable !== true
                }
                className={`w-full rounded-2xl bg-accent-400 p-4 text-sm font-semibold text-white transition-all duration-300 ${
                  isLoading ||
                  isDisplayNameAvailable !== true ||
                  isEmailAvailable !== true
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-accent-500 hover:shadow-lg"
                }`}
              >
                {isLoading ? "가입 중..." : "회원가입"}
              </button>
            </form>

            {/* 티켓 하단 정보 */}
            <div className="mt-8 border-t-2 border-dashed border-accent-300/50 pt-6 text-center">
              <div className="space-y-1 font-mono text-xs text-gray-600">
                <div>NEW MEMBER REGISTRATION</div>
                <div>TERMS & CONDITIONS APPLY</div>
                <div className="font-bold text-accent-600">
                  ★ WELCOME ABOARD ★
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
