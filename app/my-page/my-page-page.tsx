"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "store/redux-toolkit/hooks";
import SideMenu from "app/my-page/side-menu";
import dynamic from "next/dynamic";
import Loading from "app/loading";
import { UserReview } from "api/movie-reviews/fetchUserReviews";

const ProfileForm = dynamic(() => import("app/my-page/profile-form"), {
  loading: () => <Loading />,
  ssr: false,
});

const SideReviewList = dynamic(() => import("app/my-page/side-review-list"), {
  loading: () => <Loading />,
  ssr: false,
});

export default function MyPagePage({
  userReview,
}: {
  userReview: UserReview[];
}) {
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
          <div className="border-accent-300 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-black" />
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
    <>
      <SideMenu uid={userState.uid} />
      {/* Main */}
      <ProfileForm />
      <SideReviewList uid={userState.uid} userReviews={userReview} />
    </>
  );
}
