"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RootState } from "store/redux-toolkit";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import { signOut } from "firebase/auth";
import { isAuth } from "firebase-config";
import { useRouter } from "next/navigation";
import { clearUserState } from "store/redux-toolkit/slice/userSlice";
import HeaderSearchBar from "app/ui/layout/header/components/HeaderSearchBar";
import { IoIosMenu } from "react-icons/io";
import HeaderSideMenu from "app/ui/layout/header/components/HeaderSideMenu";
import { removeCookie } from "app/utils/cookieUtils";
import HeaderDropDownMenu from "app/ui/layout/header/components/HeaderDropDownMenu";

export default function Header() {
  const router = useRouter();
  const newReviewAlertState = useAppSelector(
    (state) => state.newReviewAlert.newReviewAlertState,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const users = useAppSelector((state: RootState) => state.user.user);
  const userDisplayName = users?.displayName;
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const logoutHandler = useCallback(async () => {
    try {
      // 1. Firebase 로그아웃
      await signOut(isAuth);

      // 2. 모든 인증 관련 데이터 정리
      removeCookie();
      localStorage.removeItem("rememberMe");

      // 3. Redux 상태 초기화
      dispatch(clearUserState());

      // 4. 로그인 페이지로 이동
      router.push("/login");
    } catch (error) {
      window.alert("로그아웃 중 오류가 발생했습니다.");
    }
  }, [dispatch, router]);

  const dropDownHandler = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const toggleSideMenu = useCallback(() => {
    setIsSideMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const clickOutsideHandler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.classList.add(
        "overflow-hidden",
        "h-full",
        "pointer-events-none",
      );
    } else {
      document.body.classList.remove(
        "overflow-hidden",
        "h-full",
        "pointer-events-none",
      );
    }

    return () => {
      document.body.classList.remove(
        "overflow-hidden",
        "h-full",
        "pointer-events-none",
      );
    };
  }, [isSideMenuOpen]);

  return (
    <header
      className={`relative z-10 flex w-full items-center justify-center p-8 pb-0 text-xs md:px-8 md:pt-8 ${
        isSideMenuOpen ? "pointer-events-none" : ""
      }`}
    >
      <div
        className={`flex w-full items-center justify-between rounded-full border-2 border-gray-200 bg-white md:w-auto md:justify-center md:px-4 md:py-3 ${
          isSideMenuOpen ? "pointer-events-auto" : ""
        }`}
      >
        {/* MENU */}
        <nav className="hidden md:flex">
          <ul className="flex items-center justify-center gap-3">
            <li className="group">
              <Link
                href="/"
                className="rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-gray-200"
              >
                Home
              </Link>
            </li>
            <li className="group relative">
              <Link
                href="/search"
                className="rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-gray-200"
              >
                Search
              </Link>
            </li>
            <li className="group relative">
              <Link
                href="/ticket-list"
                className="group relative rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-gray-200"
              >
                Ticket List
                {newReviewAlertState && (
                  <span className="absolute right-[0.1rem] top-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
        {/* MOBILE/ HAMBURGER MENU */}
        <div
          onClick={toggleSideMenu}
          className="flex w-full justify-end md:hidden"
        >
          <button
            className="rounded-full px-4 py-2 transition-colors duration-300 active:bg-gray-200"
            aria-label="메뉴 열기"
          >
            <IoIosMenu size={28} aria-hidden />
          </button>
        </div>

        {/* PROFILE MENU */}
        <div className="hidden md:flex">
          {userDisplayName ? (
            <HeaderDropDownMenu
              dropdownRef={dropdownRef}
              userDisplayName={userDisplayName}
              isDropdownOpen={isDropdownOpen}
              dropDownHandler={dropDownHandler}
              logoutHandler={logoutHandler}
            />
          ) : (
            <Link href="/login">
              <button type="button" className="font-bold">
                로그인
              </button>
            </Link>
          )}
        </div>
      </div>
      {/* SEARCH BAR */}
      <HeaderSearchBar />
      {/* MOBILE SIDE MENU */}
      <HeaderSideMenu
        newReviewAlertState={newReviewAlertState}
        userDisplayName={userDisplayName || ""}
        onLogout={logoutHandler}
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
      />
    </header>
  );
}
