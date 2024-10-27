"use client";

import { useState } from "react";
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
    <div className="mt-16 min-h-screen w-full bg-white md:flex md:justify-center">
      <section className="mb-3 w-full border-t-2 border-gray-200 pl-3 pt-4 text-4xl font-bold md:mb-0 md:ml-8 md:min-h-screen md:w-1/3 md:border-r-2 md:border-t-0 md:pl-0 md:pt-0 md:text-8xl">
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

          <div className="font-bold">
            <button
              type="submit"
              className={`mb-3 w-full rounded-xl bg-black p-4 text-sm text-white transition-colors duration-300 ease-in-out ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-yellow-600"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
            <Link href="/sign-up">
              <button
                type="button"
                className={`w-full rounded-xl bg-black p-4 text-sm text-white transition-colors duration-200 ease-in-out ${
                  isLoading
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-yellow-600"
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
