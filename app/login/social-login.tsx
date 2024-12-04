"use client";

import { db, isAuth } from "firebase-config";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useError } from "store/error-context";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import { useState } from "react";
import SocialLoginButton from "app/login/social-login-button";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import onGenerateDisplayName from "app/sign-up/utils/onGenerateDisplayName";
import { useAppDispatch } from "store/hooks";
import { onUpdateUserProfile } from "store/userSlice";

export type SocialProvider = "google" | "github";

export default function SocialLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isShowError } = useError();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null,
  );

  const socialLoginHandler = async (provider: SocialProvider) => {
    setLoadingProvider(provider);
    try {
      const authProvider =
        provider === "google"
          ? new GoogleAuthProvider()
          : new GithubAuthProvider();

      const { user } = await signInWithPopup(isAuth, authProvider);
      const token = await user.getIdToken();
      document.cookie = `firebase-session-token=${token}; path=/;max-age=86400`;

      // Firestore에서 사용자 확인
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      let userDisplayName = user.displayName;

      if (!userDoc.exists()) {
        // 새 사용자인 경우
        const generateDisplayName = await onGenerateDisplayName();
        userDisplayName = user.displayName || generateDisplayName;

        await setDoc(userRef, {
          name: user.displayName,
          displayName: user.displayName || generateDisplayName,
          email: user.email,
          profileImage: user.photoURL,
          provider,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          biography: "Make a ticket for your own movie review.",
          roll: "user",
        });
      } else {
        userDisplayName = userDoc.data().displayName;
        await updateDoc(userRef, {
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        });
      }

      if (userDisplayName) {
        dispatch(onUpdateUserProfile({ displayName: userDisplayName }));
      }

      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") return;

      const { title, message } = firebaseErrorHandler(error);
      isShowError(title, message);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <>
      <div className="mx-auto my-4 flex w-2/3 items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-4 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex space-x-2">
          <SocialLoginButton
            provider="google"
            icon={<FcGoogle size={24} />}
            label="Google"
            onSocialLogin={socialLoginHandler}
            isLoading={loadingProvider === "google"}
          />
          <SocialLoginButton
            provider="github"
            icon={<FaGithub size={24} />}
            label="GitHub"
            onSocialLogin={socialLoginHandler}
            isLoading={loadingProvider === "github"}
          />
        </div>
      </div>
    </>
  );
}
