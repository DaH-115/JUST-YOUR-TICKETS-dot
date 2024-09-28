"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { isAuth } from "firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import SocialLoginButtons from "app/login/social-login";

type Inputs = {
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await signInWithEmailAndPassword(isAuth, data.email, data.password);
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="mt-16 min-h-screen w-full bg-white md:flex md:justify-center">
      {/* LEFT SIDE */}
      <div className="mb-3 w-full border-t-2 border-gray-200 pl-3 pt-4 text-4xl font-bold md:mb-0 md:ml-8 md:min-h-screen md:w-1/3 md:border-r-2 md:border-t-0 md:pl-0 md:pt-0 md:text-8xl">
        <h1>LOG IN</h1>
      </div>
      {/* RIGHT SIDE */}
      <div className="md:w-2/3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto w-2/3 space-y-6 md:mt-24"
        >
          <div>
            <div className="border-b border-black py-2">
              <label
                htmlFor="email"
                className="text-xs font-medium text-gray-700"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: "이메일을 입력해주세요." })}
                className="w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="border-b border-black py-2">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="on"
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                })}
                className="w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          <div className="font-bold">
            <button
              type="submit"
              className="mb-3 w-full rounded-xl bg-black p-4 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              로그인
            </button>
            <Link href="/sign-up">
              <button
                type="button"
                className="w-full rounded-xl bg-black p-4 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                회원가입
              </button>
            </Link>
          </div>
        </form>
        {/* SocialLogin */}
        <SocialLoginButtons />
      </div>
    </div>
  );
}
