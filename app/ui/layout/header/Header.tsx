"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import { signOut } from "firebase/auth";
import { isAuth } from "firebase-config";
import { useRouter } from "next/navigation";
import { clearUser } from "store/redux-toolkit/slice/userSlice";
import { removeCookie } from "app/utils/cookieUtils";
import HeaderSearchBar from "app/ui/layout/header/components/HeaderSearchBar";
import { IoIosMenu } from "react-icons/io";
import HeaderSideMenu from "app/ui/layout/header/components/HeaderSideMenu";
import HeaderDropDownMenu from "app/ui/layout/header/components/HeaderDropDownMenu";

interface NavItem {
  href: string;
  label: string;
  showAlert?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/ticket-list", label: "Ticket List", showAlert: true },
];

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const newReviewAlertState = useAppSelector(
    (state) => state.newReviewAlert.newReviewAlertState,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDisplayName = useAppSelector(
    (state) => state.userData.auth?.displayName,
  );
  const userPhotoURL = useAppSelector((state) => state.userData.auth?.photoURL);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const dropDownHandler = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const toggleSideMenu = useCallback(() => {
    setIsSideMenuOpen((prev) => !prev);
  }, []);

  // 스크롤 감지 효과
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      className={`fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between px-4 py-8 text-xs transition-all duration-300 ease-in-out md:px-8 md:pt-8 ${
        isScrolled
          ? "bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-sm"
          : "bg-transparent"
      } ${isSideMenuOpen ? "pointer-events-none" : ""}`}
    >
      {/* LOGO */}
      <h1 className="mr-2 text-base font-bold sm:mr-4 sm:text-lg md:text-xl">
        <span className="hidden text-white sm:inline">Just Movie Tickets</span>
        <span className="text-white sm:hidden">JMT</span>
      </h1>
      <div className="flex items-center space-x-4">
        {/* MAIN NAVIGATION */}
        <div
          className={`flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 ${
            isSideMenuOpen ? "pointer-events-auto" : ""
          }`}
        >
          {/* DESKTOP MENU */}
          <nav className="hidden md:flex">
            <ul className="flex items-center justify-center gap-2">
              {navItems.map(({ href, label, showAlert }) => (
                <li key={href} className="group relative">
                  <Link
                    href={href}
                    className="rounded-full px-3 py-2 font-medium text-white/90 transition-all duration-300 ease-in-out hover:bg-white/20 hover:text-white"
                  >
                    {label}
                    {showAlert && newReviewAlertState && (
                      <span className="absolute right-[0.1rem] top-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* MOBILE HAMBURGER MENU */}
          <div
            onClick={toggleSideMenu}
            className="flex w-full justify-center md:hidden"
          >
            <button
              className="rounded-full px-4 py-2 text-white transition-colors duration-300 hover:bg-white/20"
              aria-label="메뉴 열기"
            >
              <IoIosMenu size={24} aria-hidden />
            </button>
          </div>
        </div>

        {/* USER PROFILE/LOGIN SECTION */}
        <div className="hidden md:flex">
          {userDisplayName ? (
            <div className="px-6 py-3">
              <HeaderDropDownMenu
                dropdownRef={dropdownRef}
                userDisplayName={userDisplayName}
                userPhotoURL={userPhotoURL}
                isDropdownOpen={isDropdownOpen}
                dropDownHandler={dropDownHandler}
                logoutHandler={logoutHandler}
              />
            </div>
          ) : (
            <Link href="/login">
              <button
                type="button"
                className="rounded-full border-2 border-white bg-white px-6 py-3 font-bold text-black shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl"
              >
                로그인
              </button>
            </Link>
          )}
        </div>

        {/* SEARCH BAR */}
        <HeaderSearchBar />
      </div>

      {/* MOBILE SIDE MENU */}
      <HeaderSideMenu
        newReviewAlertState={newReviewAlertState}
        userDisplayName={userDisplayName || ""}
        userPhotoURL={userPhotoURL}
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
      />
    </header>
  );
}
