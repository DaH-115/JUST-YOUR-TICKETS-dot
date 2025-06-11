"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { isAuth } from "firebase-config";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAlert } from "store/context/alertContext";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SocialLogin from "app/login/components/SocialLogin";
import InputField from "app/components/InputField";
import { FaArrowRight } from "react-icons/fa";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  rememberMe: z.boolean().default(false),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorHandler } = useAlert();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });
  const isRememberMe = watch("rememberMe");

  const onSubmit: SubmitHandler<LoginInputs> = useCallback(async (data) => {
    setIsLoading(true);

    try {
      // 1. Persistence 설정 (로컬 스토리지 또는 세션 스토리지)
      await setPersistence(
        isAuth,
        data.rememberMe ? browserLocalPersistence : browserSessionPersistence,
      );
      // 2. 로그인 시도
      await signInWithEmailAndPassword(isAuth, data.email, data.password);
      // 3. 로그인 성공시 리다이렉트
      router.push("/");
    } catch (error) {
      const { title, message } = firebaseErrorHandler(error);
      showErrorHandler(title, message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-accent-900 via-black to-accent-800 px-4 py-10 pt-32 md:pt-36 lg:pt-28">
      <div className="w-full max-w-md">
        {/* 티켓 컨테이너 */}
        <div className="relative">
          {/* 티켓 메인 부분 */}
          <div className="relative rounded-3xl border-2 border-accent-300/30 bg-white p-8 shadow-2xl">
            {/* 티켓 헤더 */}
            <div className="mb-8 border-b-4 border-dotted border-accent-300/50 pb-6 text-center">
              <div className="mb-2 font-mono text-xs font-bold tracking-wider text-accent-600">
                ADMIT ONE
              </div>
              <h3 className="mb-1 text-2xl font-bold text-gray-800">로그인</h3>
              <p className="text-sm text-gray-600">
                계정에 로그인하여 시작하세요
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <InputField
                  id="email"
                  label="이메일"
                  type="email"
                  placeholder="example@domain.com"
                  register={register}
                  error={errors.email?.message}
                  touched={touchedFields.email}
                  disabled={isLoading}
                  autoComplete={"email"}
                />

                <InputField
                  id="password"
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  register={register}
                  error={errors.password?.message}
                  touched={touchedFields.password}
                  disabled={isLoading}
                  autoComplete={"password"}
                />
              </div>

              {/* 로그인 상태 유지 */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="h-5 w-5 rounded-md border-2 border-gray-300 bg-white text-accent-500 transition-all duration-200 checked:border-accent-500 checked:bg-accent-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
                  disabled={isLoading}
                />
                <label
                  htmlFor="rememberMe"
                  className="cursor-pointer select-none text-sm font-medium text-gray-700"
                >
                  로그인 상태 유지
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className={`w-full rounded-2xl bg-accent-400 p-4 font-semibold text-white transition-all duration-300 ${
                    isLoading
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-accent-500 hover:shadow-lg"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </button>

                <Link href="/sign-up" className="mt-4 block">
                  <button
                    type="button"
                    className={`flex w-full items-center justify-center rounded-2xl border border-gray-300 bg-gray-50 p-4 font-semibold text-gray-700 transition-all duration-300 ${
                      isLoading
                        ? "cursor-not-allowed opacity-50"
                        : "hover:border-gray-400 hover:bg-gray-100"
                    }`}
                    disabled={isLoading}
                  >
                    회원가입
                    <FaArrowRight size={16} className="ml-2" />
                  </button>
                </Link>
              </div>
            </form>

            {/* 소셜 로그인 */}
            <div className="mt-8">
              <SocialLogin rememberMe={isRememberMe} />
            </div>

            {/* 티켓 하단 정보 */}
            <div className="mt-8 border-t-4 border-dotted border-accent-300/50 pt-6 text-center">
              <div className="space-y-1 font-mono text-xs text-gray-500">
                <div>VALID FOR ONE SESSION</div>
                <div>NO REFUND • NO EXCHANGE</div>
                <div className="font-bold text-accent-600">
                  ★ PREMIUM ACCESS ★
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
