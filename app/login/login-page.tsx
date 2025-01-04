"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { db, isAuth } from "firebase-config";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useError } from "store/error-context";
import { setCookie } from "app/utils/cookie-utils";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SocialLogin from "app/login/social-login";
import InputField from "app/ui/input-field";
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
  const { isShowError } = useError();
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

  const onSubmit: SubmitHandler<LoginInputs> = useCallback(
    async (data) => {
      setIsLoading(true);

      try {
        // 1. 이메일/비밀번호로 Firebase 로그인
        const userCredential = await signInWithEmailAndPassword(
          isAuth,
          data.email,
          data.password,
        );

        // 2. 사용자 이름이 없다면 Firestore에서 가져와서 설정
        if (!userCredential.user.displayName) {
          const userDoc = await getDoc(
            doc(db, "users", userCredential.user.uid),
          );
          if (userDoc.exists()) {
            const { displayName } = userDoc.data();
            await updateProfile(userCredential.user, {
              displayName,
            });
          }
        }

        // 3. 로그인 성공 후 토큰을 받아와서 저장
        const token = await userCredential.user.getIdToken();
        setCookie(token, data.rememberMe);

        // Remember Me 선택 여부를 localStorage에 저장
        if (data.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        // 4. 로그인 성공 후 메인 페이지로 이동
        router.push("/");
      } catch (error: any) {
        const { title, message } = firebaseErrorHandler(error);
        isShowError(title, message);
      } finally {
        setIsLoading(false);
      }
    },
    [router, isShowError],
  );

  return (
    <div className="w-full bg-white pb-8 md:flex md:justify-center md:py-10">
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

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              {...register("rememberMe")}
              className="h-4 w-4"
              disabled={isLoading}
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600">
              로그인 상태 유지
            </label>
          </div>

          <button
            type="submit"
            className={`w-full rounded-full bg-[#8B1E3F] p-4 text-sm text-white transition-colors duration-300 ease-in-out ${
              isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-[#551226]"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중" : "로그인"}
          </button>

          <Link href="/sign-up">
            <button
              type="button"
              className={`mt-2 flex w-full items-center justify-between rounded-full border border-[#8B1E3F] bg-white p-4 text-sm text-black transition-colors duration-300 ease-in-out ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-[#8B1E3F] hover:text-white"
              }`}
              disabled={isLoading}
            >
              회원가입
              <FaArrowRight size={16} />
            </button>
          </Link>
        </form>

        {/* Social Login */}
        <SocialLogin rememberMe={isRememberMe} />
      </main>
    </div>
  );
}
