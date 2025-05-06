import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  GithubAuthProvider,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, isAuth } from "firebase-config";
import { useAlert } from "store/context/alertContext";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import SocialLoginBtn from "app/login/components/SocialLoginBtn";
import generateUniqueNickname from "app/login/utils/generateUniqueNickname";

export type SocialProvider = "google" | "github";

export default function SocialLogin({ rememberMe }: { rememberMe: boolean }) {
  const router = useRouter();
  const { showErrorHanlder } = useAlert();
  const [isLoadingProvider, setIsLoadingProvider] =
    useState<SocialProvider | null>(null);

  const socialLoginHandler = useCallback(
    async (provider: SocialProvider) => {
      setIsLoadingProvider(provider);
      try {
        // 1. Persistence 설정
        await setPersistence(
          isAuth,
          rememberMe ? browserLocalPersistence : browserSessionPersistence,
        );

        // 2. 소셜 로그인
        const authProvider =
          provider === "google"
            ? new GoogleAuthProvider()
            : new GithubAuthProvider();
        const { user } = await signInWithPopup(isAuth, authProvider);

        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
          // 3. 랜덤 닉네임 생성 + 중복 검사
          const uniqueNick = await generateUniqueNickname(user.uid);

          // 4. Auth 프로필 업데이트
          await updateProfile(user, { displayName: uniqueNick });

          // 5. users 컬렉션에 프로필 저장
          await setDoc(userRef, {
            provider: provider,
            biography: "Make a ticket for your own movie review.",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          // 기존 유저: updatedAt만 갱신
          await updateDoc(userRef, { updatedAt: serverTimestamp() });
        }

        // 6. 로그인 성공 후 리다이렉트
        router.replace("/");
      } catch (error: any) {
        if (error.code === "auth/popup-closed-by-user") return;
        const { title, message } = firebaseErrorHandler(error);
        showErrorHanlder(title, message);
      } finally {
        setIsLoadingProvider(null);
      }
    },
    [rememberMe, router, showErrorHanlder],
  );

  return (
    <>
      <div className="mx-auto my-4 flex w-2/3 items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-4 text-xs text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="mb-4 flex items-center justify-center">
        <div className="flex space-x-2">
          <SocialLoginBtn
            provider="google"
            icon={<FcGoogle size={24} />}
            label="Google"
            onSocialLogin={socialLoginHandler}
            isLoading={isLoadingProvider === "google"}
          />
          <SocialLoginBtn
            provider="github"
            icon={<FaGithub size={24} />}
            label="GitHub"
            onSocialLogin={socialLoginHandler}
            isLoading={isLoadingProvider === "github"}
          />
        </div>
      </div>
    </>
  );
}
