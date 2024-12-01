"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import SocialLogin from "app/login/social-login";
import { useError } from "store/error-context";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import InputField from "app/ui/input-field";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, isAuth } from "firebase-config";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const signupSchema = z
  .object({
    name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다."),
    displayName: z.string().min(2, "닉네임은 최소 2글자 이상이어야 합니다."),
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

export type SignupSchema = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isShowError, isShowSuccess } = useError();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: SignupSchema) => {
    setIsLoading(true);
    const { name, displayName, email, password } = data;

    // 1. 닉네임 중복 체크
    const displayNameQuery = query(
      collection(db, "users"),
      where("displayName", "==", displayName),
      limit(1),
    );
    const displayNameSnapshot = await getDocs(displayNameQuery);

    if (!displayNameSnapshot.empty) {
      isShowError("알림", "이미 사용 중인 닉네임입니다.");
    }

    // 2. 사용자 계정 생성
    try {
      const { user } = await createUserWithEmailAndPassword(
        isAuth,
        email,
        password,
      );

      // 3. Firestore 문서 생성
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name,
        displayName,
        email,
        provider: "email",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        biography: "Make a ticket for your own movie review.",
        role: "user",
      });

      isShowSuccess("회원가입 완료", "환영합니다!");
      router.push("/");
    } catch (error) {
      const { title, message } = firebaseErrorHandler(error);
      isShowError(title, message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 w-full bg-white md:my-8 md:flex md:justify-center">
      <section className="mb-4 w-full px-4 py-2 text-xl font-bold md:mb-0 md:ml-8 md:w-1/3 md:border-r-2 md:border-gray-200 md:pl-0 md:pt-0 md:text-8xl">
        SIGN UP
      </section>
      <main className="md:w-2/3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto space-y-6 px-8 md:mt-16 md:w-2/3 md:px-0"
        >
          <InputField
            id="name"
            label="이름"
            type="text"
            placeholder="이름을 입력해 주세요"
            register={register}
            error={errors.name?.message}
            touched={touchedFields.name}
            disabled={isLoading}
          />

          <InputField
            id="displayName"
            label="닉네임"
            type="text"
            placeholder="사용하실 닉네임을 입력해 주세요"
            register={register}
            error={errors.displayName?.message}
            touched={touchedFields.displayName}
            disabled={isLoading}
          />

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

          <InputField
            id="confirmPassword"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            register={register}
            error={errors.confirmPassword?.message}
            touched={touchedFields.confirmPassword}
            disabled={isLoading}
          />

          <button
            type="submit"
            className={`mb-2 w-full rounded-full border border-black bg-black p-4 text-sm text-white transition-all duration-300 ease-in-out hover:font-bold ${
              isLoading
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-white hover:text-black"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </button>
        </form>
        {/* Social Login */}
        <SocialLogin />
      </main>
    </div>
  );
}
