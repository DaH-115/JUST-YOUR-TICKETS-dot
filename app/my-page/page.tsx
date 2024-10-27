"use client";

import { useAppSelector } from "store/hooks";
import SideMenu from "app/my-page/side-menu";
import ProfileForm from "app/my-page/profile-form";
import SideReviewList from "app/my-page/side-review-list";

export default function MyPage() {
  const userState = useAppSelector((state) => state.user.user);
  if (!userState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full flex-col px-4 py-8 lg:my-8 lg:flex-row lg:px-8 lg:py-16">
      <div className="w-1/3">
        <SideMenu uid={userState.uid} />
      </div>
      {/* Main */}
      <ProfileForm />
      <SideReviewList uid={userState.uid} />
    </div>
  );
}
