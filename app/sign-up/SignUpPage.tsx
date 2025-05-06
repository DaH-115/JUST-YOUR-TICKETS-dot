"use client";

import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAlert } from "store/context/alertContext";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import InputField from "app/components/InputField";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { db, isAuth } from "firebase-config";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
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
      .max(100, "이메일은 100글자를 초과할 수 없습니다."),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .max(100, "비밀번호는 100글자를 초과할 수 없습니다.")
      .regex(
        /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,}$/,
        "비밀번호는 숫자, 특수문자를 하나 이상 포함해야 합니다.",
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
  const { showErrorHanlder, showSuccessHanlder } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isDisplayNameAvailable, setIsDisplayNameAvailable] = useState<
    boolean | null
  >(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, touchedFields },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const displayNameValue = watch("displayName");
  const emailValue = watch("email");

  // 값 변경 시 이전 중복 검사 결과 초기화
  useEffect(() => {
    setIsDisplayNameAvailable(null);
  }, [displayNameValue]);

  useEffect(() => {
    setIsEmailAvailable(null);
  }, [emailValue]);

  // 닉네임 중복 확인
  const checkDisplayName = useCallback(async () => {
    const displayName = getValues("displayName");
    if (!displayName) {
      showErrorHanlder("알림", "닉네임을 입력해주세요.");
      return;
    }
    setIsCheckingName(true);
    try {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", displayName),
        limit(1),
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setIsDisplayNameAvailable(true);
        showSuccessHanlder("중복 확인", "사용 가능한 닉네임입니다.");
      } else {
        setIsDisplayNameAvailable(false);
        showErrorHanlder("중복 확인", "이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      const { title, message } = firebaseErrorHandler(error);
      showErrorHanlder(title, message);
      setIsDisplayNameAvailable(false);
    } finally {
      setIsCheckingName(false);
    }
  }, [getValues, showErrorHanlder, showSuccessHanlder]);

  // 이메일 중복 확인
  const checkEmail = useCallback(async () => {
    const email = getValues("email");
    if (!email) {
      showErrorHanlder("알림", "이메일을 입력해주세요.");
      return;
    }
    setIsCheckingEmail(true);
    try {
      const methods = await fetchSignInMethodsForEmail(isAuth, email);
      if (methods.length === 0) {
        setIsEmailAvailable(true);
        showSuccessHanlder("중복 확인", "사용 가능한 이메일입니다.");
      } else {
        setIsEmailAvailable(false);
        showErrorHanlder("중복 확인", "이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      const { title, message } = firebaseErrorHandler(error);
      showErrorHanlder(title, message);
      setIsEmailAvailable(false);
    } finally {
      setIsCheckingEmail(false);
    }
  }, [getValues, showErrorHanlder, showSuccessHanlder]);

  // 회원가입 처리
  const onSubmit = useCallback(
    async (data: SignupSchema) => {
      setIsLoading(true);
      try {
        const { displayName, email, password } = data;
        // 1. 로컬 영속성 설정
        await setPersistence(isAuth, browserLocalPersistence);
        // 2. 계정 생성
        const { user } = await createUserWithEmailAndPassword(
          isAuth,
          email,
          password,
        );
        // 3. 프로필에 디스플레이네임 설정
        await updateProfile(user, { displayName });
        // 4. Firestore 트랜잭션
        await runTransaction(db, async (transaction) => {
          const usernameRef = doc(db, "usernames", displayName);
          const usernameSnap = await transaction.get(usernameRef);
          if (usernameSnap.exists()) {
            throw new Error("이미 사용 중인 닉네임입니다.");
          }
          transaction.set(usernameRef, {
            uid: user.uid,
            createdAt: serverTimestamp(),
          });

          const userRef = doc(db, "users", user.uid);
          transaction.set(userRef, {
            provider: "email",
            biography: "Make a ticket for your own movie review.",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });

        showSuccessHanlder("회원가입 완료", "환영합니다!");
        router.replace("/");
      } catch (error) {
        const { title, message } = firebaseErrorHandler(error);
        showErrorHanlder(title, message);
        if (isAuth.currentUser) await isAuth.currentUser.delete();
      } finally {
        setIsLoading(false);
      }
    },
    [router, showErrorHanlder, showSuccessHanlder],
  );

  return (
    <main className="mt-8 w-full border-t-4 border-accent-300 bg-white pb-8 md:flex md:justify-center md:py-10">
      <h1 className="mb-4 w-full px-4 py-2 text-xl font-bold md:mb-0 md:ml-8 md:w-1/3 md:border-r-2 md:border-gray-200 md:pl-0 md:pt-0 md:text-4xl">
        SIGN UP
      </h1>
      <div className="md:w-2/3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto px-8 md:w-2/3 md:px-0"
        >
          <div className="space-y-6">
            <InputField
              id="name"
              label="이름"
              type="text"
              placeholder="이름을 입력해 주세요"
              register={register}
              error={errors.name?.message}
              touched={touchedFields.name}
              disabled={isLoading}
              autoComplete={"name"}
            />

            <div className="flex items-center space-x-2">
              <div className="w-full">
                <InputField
                  id="displayName"
                  label="닉네임"
                  type="text"
                  placeholder="사용하실 닉네임을 입력해 주세요"
                  register={register}
                  error={errors.displayName?.message}
                  touched={touchedFields.displayName}
                  disabled={isLoading}
                  autoComplete={"displayName"}
                />
              </div>
              <button
                type="button"
                onClick={checkDisplayName}
                disabled={isCheckingName || !displayNameValue}
                className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm transition-all duration-200 ease-in-out hover:underline ${isCheckingName || !displayNameValue ? "cursor-not-allowed opacity-50" : "bg-black text-white"}`}
              >
                {isCheckingName ? "검사 중..." : "중복 확인"}
              </button>
            </div>
            {isDisplayNameAvailable !== null && (
              <p
                className={`text-sm ${isDisplayNameAvailable ? "text-green-600" : "text-red-600"}`}
              >
                {isDisplayNameAvailable
                  ? "사용 가능한 닉네임입니다."
                  : "이미 사용 중인 닉네임입니다."}
              </p>
            )}

            <div className="flex items-center space-x-2">
              <div className="w-full">
                <InputField
                  id="email"
                  label="이메일"
                  type="email"
                  placeholder="이메일을 입력해 주세요"
                  register={register}
                  error={errors.email?.message}
                  touched={touchedFields.email}
                  disabled={isLoading}
                  autoComplete={"email"}
                />
              </div>
              <button
                type="button"
                onClick={checkEmail}
                disabled={isCheckingEmail || !emailValue}
                className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm transition-all duration-200 ease-in-out hover:underline ${isCheckingEmail || !emailValue ? "cursor-not-allowed opacity-50" : "bg-black text-white"}`}
              >
                {isCheckingEmail ? "검사 중..." : "중복 확인"}
              </button>
            </div>
            {isEmailAvailable !== null && (
              <p
                className={`text-sm ${isEmailAvailable ? "text-green-600" : "text-red-600"}`}
              >
                {isEmailAvailable
                  ? "사용 가능한 이메일입니다."
                  : "이미 사용 중인 이메일입니다."}
              </p>
            )}

            <InputField
              id="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              register={register}
              error={errors.password?.message}
              touched={touchedFields.password}
              disabled={isLoading}
              autoComplete={"password"}
            />

            <InputField
              id="confirmPassword"
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 한 번 더 입력해 주세요"
              register={register}
              error={errors.confirmPassword?.message}
              touched={touchedFields.confirmPassword}
              disabled={isLoading}
              autoComplete={"confirmPassword"}
            />
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              isDisplayNameAvailable !== true ||
              isEmailAvailable !== true
            }
            className={`mt-10 w-full rounded-full bg-primary-500 p-4 text-sm text-white transition-all duration-300 ease-in-out hover:bg-primary-700 ${isLoading || isDisplayNameAvailable !== true || isEmailAvailable !== true ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {isLoading ? "가입 중" : "회원가입"}
          </button>
        </form>
      </div>
    </main>
  );
}
