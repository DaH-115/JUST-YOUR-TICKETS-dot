"use client";

import { useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { isAuth } from "firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useError } from "store/error-context";
import { firebaseErrorHandler } from "app/my-page/utils/firebase-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SocialLogin from "app/login/social-login";
import InputField from "app/ui/input-field";

export const metadata: Metadata = {
  title: "Login",
};

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isShowError } = useError();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(isAuth, data.email, data.password);
      router.push("/");
    } catch (error: any) {
      const { title, message } = firebaseErrorHandler(error);
      isShowError(title, message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 w-full bg-white md:my-8 md:flex md:justify-center">
      <section className="mb-4 w-full px-4 py-2 text-xl font-bold md:mb-0 md:ml-8 md:w-1/3 md:border-r-2 md:border-gray-200 md:pl-0 md:pt-0 lg:text-8xl">
        <h1>LOG IN</h1>
      </section>
      <main className="md:w-2/3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto w-2/3 space-y-6 md:mt-24"
        >
          <InputField
            id="email"
            label="이메일"
            type="email"
            placeholder="you@example.com"
            register={register}
            error={errors.email?.message}
            touched={touchedFields.email}
            disabled={isLoading}
          />

          <InputField
            id="password"
            label="비밀번호"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password?.message}
            touched={touchedFields.password}
            disabled={isLoading}
          />

          <div className="">
            <button
              type="submit"
              className={`mb-2 w-full rounded-xl border border-black bg-black p-2 text-sm text-white transition-colors duration-300 ease-in-out ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-white hover:text-black"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
            <Link href="/sign-up">
              <button
                type="button"
                className={`w-full rounded-xl border border-black bg-white p-2 text-sm text-black transition-colors duration-300 ease-in-out ${
                  isLoading
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-black hover:text-white"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                disabled={isLoading}
              >
                회원가입
              </button>
            </Link>
          </div>
        </form>

        {/* Social Login */}
        <SocialLogin />
      </main>
    </div>
  );
}
