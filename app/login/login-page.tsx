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
import { useAppDispatch } from "store/hooks";
import { onUpdateUserProfile } from "store/userSlice";

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

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { isShowError } = useError();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        isAuth,
        data.email,
        data.password,
      );

      if (userCredential.user.displayName) {
        dispatch(
          onUpdateUserProfile({
            displayName: userCredential.user.displayName,
          }),
        );
      }

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
      <section className="mb-4 w-full px-4 py-2 text-xl font-bold md:mb-0 md:ml-8 md:w-1/3 md:border-r-2 md:border-gray-200 md:pl-0 md:pt-0 md:text-8xl">
        <h1>LOG IN</h1>
      </section>
      <main className="md:w-2/3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto space-y-6 px-8 md:mt-16 md:w-2/3 md:px-0"
        >
          <InputField
            id="email"
            label="이메일"
            type="email"
            placeholder="이메일을 입력해 주세요"
            register={register}
            error={errors.email?.message}
            touched={touchedFields.email}
            disabled={isLoading}
          />

          <InputField
            id="password"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            register={register}
            error={errors.password?.message}
            touched={touchedFields.password}
            disabled={isLoading}
          />

          <button
            type="submit"
            className={`w-full rounded-xl border border-black bg-black p-4 text-sm text-white transition-all duration-300 ease-in-out hover:font-bold ${
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
              className={`mt-2 w-full rounded-xl border border-black bg-white p-4 text-sm text-black transition-all duration-300 ease-in-out hover:font-bold ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-black hover:text-white"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              disabled={isLoading}
            >
              회원가입
            </button>
          </Link>
        </form>

        {/* Social Login */}
        <SocialLogin />
      </main>
    </div>
  );
}
