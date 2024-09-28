"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db, isAuth } from "firebase-config";
import { useRouter } from "next/navigation";
import SocialLogin from "app/login/social-login";
import { doc, setDoc } from "firebase/firestore";

const signupSchema = z
  .object({
    name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다."),
    email: z
      .string()
      .email("올바른 이메일 형식이 아닙니다.")
      .min(1, "이메일을 입력해주세요."),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_])/,
        "비밀번호는 영문자, 숫자, 특수문자를 하나 이상 포함해야 합니다.",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호와 확인 비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type SignupSchema = z.infer<typeof signupSchema>;

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: SignupSchema) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        isAuth,
        data.email,
        data.password,
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: data.name,
      });

      await setDoc(doc(db, "users", user.uid), {
        biography: "Make a ticket for your own movie review.",
      });

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
        SIGN UP
      </div>
      {/* RIGHT SIDE */}
      <div className="md:w-2/3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto w-2/3 space-y-6 md:mt-16"
        >
          <div>
            <div className="border-b border-black py-2">
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-700"
              >
                이름
              </label>
              <input
                id="name"
                type="text"
                placeholder="홍길동"
                {...register("name")}
                className="mt-1 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              />
            </div>
            {touchedFields.name && errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <div className="border-b border-black py-2">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="mt-1 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              />
            </div>
            {touchedFields.email && errors.email && (
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
                {...register("password")}
                className="mt-1 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              />
            </div>
            {touchedFields.password && errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <div className="border-b border-black py-2">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className="mt-1 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              />
              {touchedFields.confirmPassword && errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          <button
            type="submit"
            className="mb-3 w-full rounded-xl bg-black p-4 text-sm font-medium text-white transition-colors duration-200 ease-in-out hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            회원가입
          </button>
        </form>
        {/* SocialLogin */}
        <SocialLogin />
      </div>
    </div>
  );
}
