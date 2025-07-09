import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import SocialLoginBtn from "app/login/components/SocialLoginBtn";
import { setRememberMe } from "app/utils/authPersistence";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { getIdToken } from "app/utils/getIdToken";
import { isAuth } from "firebase-config";
import { useAlert } from "store/context/alertContext";

export type SocialProvider = "google" | "github";

export default function SocialLogin({ rememberMe }: { rememberMe: boolean }) {
  const router = useRouter();
  const { showErrorHandler } = useAlert();
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

        // 2. 로그인 상태 유지 설정 저장
        setRememberMe(rememberMe);

        // 3. Firebase ID Token 가져오기
        const idToken = await getIdToken();
        if (!idToken) {
          throw new Error("로그인 토큰을 가져올 수 없습니다.");
        }

        // 4. REST API로 소셜 로그인 후처리
        const response = await fetch("/api/auth/social-setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            provider: provider,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "소셜 로그인 처리에 실패했습니다.");
        }

        // 5. 로그인 성공 후 리다이렉트
        router.replace("/");
      } catch (error: any) {
        if (error.code === "auth/popup-closed-by-user") return;
        const { title, message } = firebaseErrorHandler(error);
        showErrorHandler(title, message);
      } finally {
        setIsLoadingProvider(null);
      }
    },
    [rememberMe, router, showErrorHandler],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div className="flex-grow border-t-4 border-dotted border-gray-300"></div>
        <span className="mx-4 font-mono text-xs text-gray-600">또는</span>
        <div className="flex-grow border-t-4 border-dotted border-gray-300"></div>
      </div>

      <div className="flex flex-col space-y-3">
        <SocialLoginBtn
          provider="google"
          icon={<FcGoogle size={20} />}
          label="Google로 계속하기"
          onSocialLogin={socialLoginHandler}
          isLoading={isLoadingProvider === "google"}
        />
        <SocialLoginBtn
          provider="github"
          icon={<FaGithub size={20} />}
          label="GitHub로 계속하기"
          onSocialLogin={socialLoginHandler}
          isLoading={isLoadingProvider === "github"}
        />
      </div>
    </div>
  );
}
