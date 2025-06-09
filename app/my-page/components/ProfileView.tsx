"use client";

import { useAppSelector, useAppDispatch } from "store/redux-toolkit/hooks";
import { FaEdit, FaArrowRight, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { signOut } from "firebase/auth";
import { isAuth } from "firebase-config";
import { clearUser } from "store/redux-toolkit/slice/userSlice";
import { removeCookie } from "app/utils/cookieUtils";
import formatDate from "app/utils/formatDate";
import ProfileAvatar from "app/my-page/components/profile-avatar/ProfileAvatar";
import useProfileStats from "app/my-page/hooks/useProfileStats";

export default function ProfileView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userAuth = useAppSelector((state) => state.userData.auth);
  const uid = useAppSelector((state) => state.userData.auth?.uid);
  const userMetaData = useAppSelector((state) => state.userData.metaData);
  const {
    myTicketsCount,
    likedTicketsCount,
    loading: statsLoading,
  } = useProfileStats(uid);

  // 활동 레벨 계산
  const getActivityLevel = () => {
    if (statsLoading)
      return {
        label: "...",
        badgeColor: "bg-gray-100 text-gray-500",
        bgGradient: "from-gray-50 to-gray-100",
      };

    if (myTicketsCount >= 50)
      return {
        label: "EXPERT",
        badgeColor: "bg-purple-100 text-purple-700",
        bgGradient: "from-purple-50 to-purple-100",
      };
    if (myTicketsCount >= 20)
      return {
        label: "ACTIVE",
        badgeColor: "bg-blue-100 text-blue-700",
        bgGradient: "from-blue-50 to-blue-100",
      };
    if (myTicketsCount >= 5)
      return {
        label: "REGULAR",
        badgeColor: "bg-green-100 text-green-700",
        bgGradient: "from-green-50 to-green-100",
      };
    return {
      label: "NEWBIE",
      badgeColor: "bg-yellow-100 text-yellow-700",
      bgGradient: "from-yellow-50 to-yellow-100",
    };
  };

  const activityLevel = getActivityLevel();

  const logoutHandler = useCallback(async () => {
    try {
      // 1. Firebase 로그아웃
      await signOut(isAuth);

      // 2. 모든 인증 관련 데이터 정리
      removeCookie();
      localStorage.removeItem("rememberMe");

      // 3. Redux 상태 초기화
      dispatch(clearUser());

      // 4. 로그인 페이지로 이동
      router.replace("/login");
    } catch (error) {
      window.alert("로그아웃 중 오류가 발생했습니다.");
    }
  }, [dispatch, router]);

  return (
    <main className="flex min-h-full w-full flex-col pl-0 md:w-3/4 md:pl-4">
      {/* 프로필 티켓 카드 */}
      <div className="mb-8 flex flex-col items-stretch overflow-hidden rounded-xl bg-white shadow-xl md:flex-row">
        {/* 프로필 이미지 섹션 (데스크톱: 티켓 왼쪽, 모바일: 티켓 상단) */}
        <div
          className={`flex flex-col items-center justify-center bg-gradient-to-b ${activityLevel.bgGradient} p-6 md:w-1/3`}
        >
          <ProfileAvatar />
        </div>

        {/* 프로필 정보 섹션 (데스크톱: 티켓 오른쪽, 모바일: 티켓 하단) */}
        <div className="flex flex-1 flex-col p-6">
          {/* 상단: 사용자명 & 이메일 & 편집 버튼 */}
          <div className="border-b-4 border-dotted pb-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-800">
                    {userAuth?.displayName || "사용자"}
                  </h1>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${activityLevel.badgeColor}`}
                  >
                    {activityLevel.label}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{userAuth?.email}</p>
              </div>
              <div className="flex items-center">
                <Link
                  href="/my-page/edit"
                  className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black"
                >
                  <FaEdit size={10} />
                  편집
                </Link>
              </div>
            </div>
          </div>

          {/* 중간: 통계 정보 */}
          <div className="border-b-4 border-dotted py-3">
            <div className="flex gap-6">
              <Link
                href={`/my-page/my-ticket-list?uid=${uid}`}
                className="text-center transition-opacity hover:opacity-80"
              >
                <div className="text-lg font-bold text-gray-800">
                  {statsLoading ? "..." : myTicketsCount}
                </div>
                <div className="text-xs text-gray-500">내 티켓</div>
              </Link>
              <div className="border-l-2 border-dotted pl-6">
                <Link
                  href={`/my-page/liked-ticket-list?uid=${uid}`}
                  className="text-center transition-opacity hover:opacity-80"
                >
                  <div className="text-lg font-bold text-gray-800">
                    {statsLoading ? "..." : likedTicketsCount}
                  </div>
                  <div className="text-xs text-gray-500">좋아요</div>
                </Link>
              </div>
            </div>
          </div>

          {/* 하단: 바이오 */}
          <div className="flex-1 pt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-800">
              Biography
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {userMetaData?.biography || "소개글이 없습니다."}
            </p>

            {/* 가입일 */}
            <div className="mt-4 border-t-4 border-dotted pt-3">
              <div className="text-xs text-gray-400">가입일</div>
              <div className="text-sm text-gray-500">
                {userMetaData?.createdAt
                  ? formatDate(new Date(userMetaData.createdAt).toISOString())
                  : "정보 없음"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 전용 링크 */}
      <div className="mt-auto block pt-8 md:hidden">
        <div className="space-y-4">
          <Link href={`/my-page/my-ticket-list?uid=${uid}`} className="block">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">내 티켓 목록</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {statsLoading ? "..." : `${myTicketsCount}개의 티켓`}
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
            href={`/my-page/liked-ticket-list?uid=${uid}`}
            className="block"
          >
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">좋아요한 티켓</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {statsLoading ? "..." : `${likedTicketsCount}개의 티켓`}
                  </p>
                </div>
                <div className="rounded-full bg-gray-200 p-2 transition-transform group-hover:translate-x-1">
                  <FaArrowRight className="text-gray-700" size={14} />
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gray-200 opacity-20"></div>
            </div>
          </Link>
          <button onClick={logoutHandler} className="block w-full text-left">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">로그아웃</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    계정에서 안전하게 로그아웃
                  </p>
                </div>
                <div className="rounded-full bg-gray-200 p-2 transition-transform group-hover:translate-x-1">
                  <FaSignOutAlt className="text-gray-700" size={14} />
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gray-200 opacity-20"></div>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
