"use client";

import { useAppSelector } from "store/hooks";
import SideMenu from "app/my-page/side-menu";
import ProfileForm from "app/my-page/profile-form";
import SideReviewList from "app/my-page/side-review-list";

export default function MyPagePage() {
  const userState = useAppSelector((state) => state.user.user);

  if (!userState) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <p className="animate-pulse text-xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col px-4 py-4 md:h-96 md:py-8 lg:flex-row lg:px-8">
      <SideMenu uid={userState.uid} />
      {/* Main */}
      <ProfileForm />
      <SideReviewList uid={userState.uid} />
    </section>
  );
}
