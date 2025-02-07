"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "store/redux-toolkit/hooks";
import SideMenu from "app/my-page/side-menu";
import ProfileForm from "app/my-page/profile-form";

export default function MyPagePage() {
  const router = useRouter();
  const userState = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (!userState) {
      router.push(`/login?returnUrl=${encodeURIComponent("/my-page")}`);
    }
  }, [userState, router]);

  if (!userState) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="alert"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-accent-300 border-t-black" />
          <div className="mb-2 text-lg text-gray-300">
            로그인이 필요한 페이지입니다
          </div>
          <div className="text-gray-500">
            잠시 후 로그인 페이지로 이동합니다
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full p-8">
      <SideMenu uid={userState.uid} />
      <ProfileForm />
    </div>
  );
}
