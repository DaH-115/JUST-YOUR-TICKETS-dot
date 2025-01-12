"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useError } from "store/context/error-context";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import InputField from "app/components/input-field";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db, isAuth } from "firebase-config";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

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
      .max(100, "이메일은 100글자를 초과할 수 없습니다.")
      .refine(
        (email) => /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email),
        "올바른 이메일 도메인이 아닙니다.",
      ),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .max(100, "비밀번호는 100글자를 초과할 수 없습니다.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,}$/,
        "비밀번호는 대소문자, 숫자, 특수문자를 하나 이상 포함해야 합니다.",
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

  const onSubmit = useCallback(
    async (data: SignupSchema) => {
      setIsLoading(true);

      try {
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
          return;
        }

        // 2. 사용자 계정 생성
        const { user } = await createUserWithEmailAndPassword(
          isAuth,
          email,
          password,
        );

        // 3. Auth Profile 업데이트
        await updateProfile(user, {
          displayName: displayName,
        });

        // 4. Firestore 문서 생성
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          name,
          displayName,
          email,
          profileImage: null,
          provider: "email",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          biography: "Make a ticket for your own movie review.",
          role: "user",
        });

        isShowSuccess("회원가입 완료", "환영합니다!");
        router.push("/");
      } catch (error) {
        const { title, message } = firebaseErrorHandler(error);
        isShowError(title, message);

        // Error 상황에서 Auth 계정이 생성된 경우 삭제
        if (isAuth.currentUser) {
          await isAuth.currentUser.delete();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router, isShowError, isShowSuccess],
  );

  return (
    <div className="w-full bg-white pb-8 pt-2 md:mt-4 md:flex md:justify-center md:py-10">
      <section className="mb-4 w-full px-4 py-2 text-xl font-bold md:mb-0 md:ml-8 md:w-1/3 md:border-r-2 md:border-gray-200 md:pl-0 md:pt-0 md:text-8xl">
        SIGN UP
      </section>
      <main className="md:w-2/3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto space-y-6 px-8 md:w-2/3 md:px-0 md:pt-8"
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
            className={`mb-2 w-full rounded-full bg-primary-500 p-4 text-sm text-white transition-all duration-300 ease-in-out ${
              isLoading
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-primary-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </button>
        </form>
      </main>
    </div>
  );
}
