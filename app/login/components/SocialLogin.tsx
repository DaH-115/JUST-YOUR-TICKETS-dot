import { db, isAuth } from "firebase-config";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAlert } from "store/context/alertContext";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { useCallback, useState } from "react";
import SocialLoginBtn from "app/login/components/SocialLoginBtn";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import generateDisplayName from "app/login/utils/generateDisplayName";
import { setCookie } from "app/utils/cookieUtils";

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
        // 1. 소셜 로그인
        const authProvider =
          provider === "google"
            ? new GoogleAuthProvider()
            : new GithubAuthProvider();
        const { user } = await signInWithPopup(isAuth, authProvider);

        // 2. 토큰 생성
        const token = await user.getIdToken();
        setCookie(token, rememberMe);

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        // 3. Firestore 사용자 정보 확인
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // 3-1. 첫 로그인일 경우 Firestore에 사용자 정보 생성
          const generatedDisplayName = await generateDisplayName();

          await setDoc(userRef, {
            name: user.displayName,
            displayName: user.displayName || generatedDisplayName,
            email: user.email,
            profileImage: user.photoURL,
            provider,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            biography: "Make a ticket for your own movie review.",
            roll: "user",
          });
        } else {
          // 3-2. 기존 사용자의 경우 최종 접속 시간만 업데이트
          await updateDoc(userRef, {
            updatedAt: serverTimestamp(),
          });
        }

        router.push("/");
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
      <div className="flex items-center justify-center">
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
