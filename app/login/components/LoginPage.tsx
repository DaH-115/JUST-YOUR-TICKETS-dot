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
  const { showErrorHanlder } = useAlert();
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
      showErrorHanlder(title, message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="mt-8 w-full border-t-4 border-accent-300 bg-white pb-8 pt-4 md:flex md:justify-center md:py-10">
      <h1 className="mb-4 w-full px-4 py-2 text-xl font-bold md:mb-0 md:ml-8 md:w-1/3 md:border-r-2 md:border-gray-200 md:pl-0 md:pt-0 md:text-8xl">
        LOG IN
      </h1>
      <div className="md:w-2/3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto px-8 md:mt-16 md:w-2/3 md:px-0"
        >
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
            placeholder=""
            register={register}
            error={errors.password?.message}
            touched={touchedFields.password}
            disabled={isLoading}
            autoComplete={"password"}
          />

          {/* Remember Me */}
          <div className="my-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              {...register("rememberMe")}
              className="h-4 w-4"
              disabled={isLoading}
            />
            <label htmlFor="rememberMe" className="text-xs text-gray-600">
              로그인 상태 유지
            </label>
          </div>

          <button
            type="submit"
            className={`w-full rounded-full bg-primary-500 p-4 text-sm text-white transition-colors duration-300 ease-in-out ${
              isLoading
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-primary-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중" : "로그인"}
          </button>

          <Link href="/sign-up">
            <button
              type="button"
              className={`mt-2 flex w-full items-center justify-center rounded-full border border-primary-500 bg-white p-4 text-sm text-black transition-colors duration-300 ease-in-out ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isLoading}
            >
              회원가입
              <FaArrowRight size={16} className="ml-2 text-primary-700" />
            </button>
          </Link>
        </form>

        {/* Social Login */}
        <SocialLogin rememberMe={isRememberMe} />
      </div>
    </main>
  );
}
