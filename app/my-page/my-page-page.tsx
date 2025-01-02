"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "store/hooks";
import SideMenu from "app/my-page/side-menu";
import ProfileForm from "app/my-page/profile-form";
import SideReviewList from "app/my-page/side-review-list";

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
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-black" />
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
    <section className="flex w-full flex-col px-4 py-4 md:h-96 md:py-8 lg:min-h-screen lg:flex-row lg:px-8">
      <SideMenu uid={userState.uid} />
      {/* Main */}
      <ProfileForm />
      <SideReviewList uid={userState.uid} />
    </section>
  );
}
