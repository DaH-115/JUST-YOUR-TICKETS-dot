"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useEffect } from "react";
import { FaEdit, FaArrowRight, FaSignOutAlt } from "react-icons/fa";
import Loading from "app/loading";
import ProfileAvatar from "app/components/user/ProfileAvatar";
import UserGradeInfo from "app/my-page/components/UserGradeInfo";
import { clearAuthPersistence } from "app/utils/authPersistence";
import formatDate from "app/utils/formatDate";
import { isAuth } from "firebase-config";
import {
  getActivityLevel,
  getActivityLevelInfo,
  getLoadingActivityLevel,
} from "lib/utils/getActivityLevel";
import { useAppSelector, useAppDispatch } from "store/redux-toolkit/hooks";
import {
  clearUser,
  selectUser,
  selectUserStatus,
  fetchUserProfile,
} from "store/redux-toolkit/slice/userSlice";

export default function ProfileView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userStatus = useAppSelector(selectUserStatus);

  useEffect(() => {
    if (!user?.uid) return;

    if (userStatus === "idle" || userStatus === "loading") {
      const needsProfileData =
        !user.biography ||
        !user.activityLevel ||
        !user.provider ||
        user.myTicketsCount === undefined ||
        user.likedTicketsCount === undefined;
      if (needsProfileData) {
        dispatch(fetchUserProfile(user.uid));
      }
    }
  }, [
    dispatch,
    user?.uid,
    userStatus,
    user?.biography,
    user?.activityLevel,
    user?.provider,
    user?.myTicketsCount,
    user?.likedTicketsCount,
  ]);

  const activityLevel = useMemo(() => {
    if (userStatus === "loading") {
      return getLoadingActivityLevel();
    }
    if (user?.activityLevel) {
      return getActivityLevelInfo(user.activityLevel);
    }
    return getActivityLevel(user?.myTicketsCount || 0);
  }, [userStatus, user?.activityLevel, user?.myTicketsCount]);

  const logoutHandler = useCallback(async () => {
    try {
      await signOut(isAuth);
      clearAuthPersistence();
      dispatch(clearUser());
      router.replace("/login");
    } catch (error: unknown) {
      console.error("로그아웃 실패:", error);
      window.alert("로그아웃 중 오류가 발생했습니다.");
    }
  }, [dispatch, router]);

  if (userStatus === "loading") {
    return <Loading />;
  }

  return (
    <main className="flex w-full flex-col pl-0 md:w-3/4 md:pl-4">
      <div className="flex flex-col items-stretch overflow-hidden rounded-xl bg-white shadow-xl md:flex-row">
        <div
          className={`flex flex-col items-center justify-center bg-gradient-to-b ${activityLevel.bgGradient} p-6 md:w-1/3`}
        >
          <ProfileAvatar
            userDisplayName={user?.displayName || "사용자"}
            s3photoKey={user?.photoKey || undefined}
            size={128}
            showLoading={true}
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="border-b-4 border-dotted pb-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-800">
                    {user?.displayName || "사용자"}
                  </h1>
                  <UserGradeInfo
                    currentLevel={activityLevel}
                    currentReviewCount={user?.myTicketsCount || 0}
                  />
                </div>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <Link
                href="/my-page/edit"
                className="flex items-center gap-2 rounded-full bg-accent-300 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-500"
              >
                <FaEdit size={12} />
                프로필 편집
              </Link>
            </div>
          </div>

          <div className="border-b-4 border-dotted py-3">
            <div className="flex gap-6">
              <Link
                href={`/my-page/my-ticket-list?uid=${user?.uid}`}
                className="text-center transition-opacity hover:opacity-80"
              >
                <div className="text-lg font-bold text-gray-800">
                  {user?.myTicketsCount || 0}
                </div>
                <div className="text-xs text-gray-600">내 티켓</div>
              </Link>
              <div className="border-l-4 border-dotted pl-6">
                <Link
                  href={`/my-page/liked-ticket-list?uid=${user?.uid}`}
                  className="text-center transition-opacity hover:opacity-80"
                >
                  <div className="text-lg font-bold text-gray-800">
                    {user?.likedTicketsCount || 0}
                  </div>
                  <div className="text-xs text-gray-600">좋아요</div>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-1 pt-3">
            <div className="mb-2 text-xs text-gray-800">자기 소개</div>
            <p className="text-sm">{user?.biography || "소개글이 없습니다."}</p>
            <div className="mt-4 border-t-4 border-dotted pt-3">
              <div className="mb-2 text-xs text-gray-800">가입일</div>
              <div className="text-xs text-gray-700">
                {user?.createdAt ? formatDate(user.createdAt) : "정보 없음"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block pt-8 md:hidden">
        <div className="space-y-4">
          <Link href="/my-page/edit" className="block">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-300 to-accent-500 p-5 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">프로필 편집</h3>
                  <p className="mt-1 text-sm text-accent-100">
                    프로필 정보를 수정하세요
                  </p>
                </div>
                <div className="rounded-full bg-white bg-opacity-20 p-2 transition-transform group-hover:translate-x-1">
                  <FaEdit className="text-white" size={14} />
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white opacity-10"></div>
            </div>
          </Link>
          <Link
            href={`/my-page/my-ticket-list?uid=${user?.uid}`}
            className="block"
          >
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">내 티켓 목록</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {user?.myTicketsCount || 0}개의 티켓
                  </p>
                </div>
                <div className="rounded-full bg-gray-200 p-2 transition-transform group-hover:translate-x-1">
                  <FaArrowRight className="text-gray-700" size={14} />
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gray-200 opacity-20"></div>
            </div>
          </Link>
          <Link
            href={`/my-page/liked-ticket-list?uid=${user?.uid}`}
            className="block"
          >
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">좋아요한 티켓</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {user?.likedTicketsCount || 0}개의 티켓
                  </p>
                </div>
                <div className="rounded-full bg-gray-200 p-2 transition-transform group-hover:translate-x-1">
                  <FaArrowRight className="text-gray-700" size={14} />
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gray-200 opacity-20"></div>
            </div>
          </Link>

          <button
            onClick={logoutHandler}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-red-400 to-red-600 p-5 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">로그아웃</h3>
                <p className="mt-1 text-sm text-red-100">
                  안전하게 로그아웃합니다
                </p>
              </div>
              <div className="rounded-full bg-white bg-opacity-20 p-2 transition-transform group-hover:translate-x-1">
                <FaSignOutAlt className="text-white" size={14} />
              </div>
            </div>
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white opacity-10"></div>
          </button>
        </div>
      </div>
    </main>
  );
}
