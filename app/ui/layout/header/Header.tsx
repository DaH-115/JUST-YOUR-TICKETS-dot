"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IoIosMenu } from "react-icons/io";
import HeaderDropDownMenu from "app/ui/layout/header/components/HeaderDropDownMenu";
import HeaderSearchBar from "app/ui/layout/header/components/HeaderSearchBar";
import HeaderSideMenu from "app/ui/layout/header/components/HeaderSideMenu";
import { isAuth } from "firebase-config";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import { clearUser, selectUser } from "store/redux-toolkit/slice/userSlice";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/ticket-list", label: "Ticket List" },
];

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userDisplayName = user?.displayName;
  const userPhotoURL = user?.photoKey;
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const logoutHandler = useCallback(async () => {
    try {
      // 1. Firebase 로그아웃
      await signOut(isAuth);

      // 2. 모든 인증 관련 데이터 정리
      localStorage.removeItem("rememberMe");

      // 3. Redux 상태 초기화
      dispatch(clearUser());

      // 4. 로그인 페이지로 이동
      router.replace("/login");
    } catch (error) {
      window.alert("로그아웃 중 오류가 발생했습니다.");
    }
  }, [dispatch, router]);

  const toggleSideMenu = useCallback(() => {
    setIsSideMenuOpen((prev) => !prev);
  }, []);

  // 스크롤 감지 효과
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSideMenuOpen]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between px-4 py-4 text-xs transition-all duration-300 ease-in-out md:px-8 md:py-8 ${
        isScrolled && !isSideMenuOpen
          ? "bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      {/* LOGO */}
      <h1 className="mr-2 text-lg font-bold sm:mr-4 sm:text-lg md:text-xl">
        <span className="hidden text-white sm:inline">Just Your Tickets</span>
        <span className="text-white sm:hidden">JYT</span>
      </h1>

      {/* DESKTOP NAVIGATION - 중앙 배치 */}
      <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <div
          className={`flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 transition-all duration-300 hover:border-white/50 hover:bg-white/20 ${
            !isSideMenuOpen ? "backdrop-blur-sm" : ""
          }`}
        >
          <nav>
            <ul className="flex items-center justify-center gap-2">
              {navItems.map(({ href, label }) => (
                <li key={href} className="group relative">
                  <Link
                    href={href}
                    className="rounded-full px-3 py-2 font-medium text-white/90 transition-all duration-300 ease-in-out hover:bg-white/20 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* USER PROFILE/LOGIN SECTION */}
        <div
          className={`hidden transition-all duration-300 md:flex ${isSearchOpen ? "invisible opacity-0" : "visible opacity-100"}`}
        >
          {userDisplayName ? (
            <div className="px-6 py-3">
              <HeaderDropDownMenu
                userDisplayName={userDisplayName}
                userPhotoURL={userPhotoURL}
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
        <HeaderSearchBar
          isSideMenuOpen={isSideMenuOpen}
          onSearchOpenChange={setIsSearchOpen}
        />

        {/* MOBILE HAMBURGER MENU - 오른쪽 끝 배치 */}
        <button
          onClick={toggleSideMenu}
          className="rounded-full p-2 text-white transition-colors duration-300 hover:bg-white/20 md:hidden"
          aria-label="메뉴 열기"
        >
          <IoIosMenu size={20} aria-hidden />
        </button>
      </div>

      {/* MOBILE SIDE MENU */}
      <HeaderSideMenu
        userDisplayName={userDisplayName || ""}
        userPhotoURL={userPhotoURL}
        userEmail={user?.email || ""}
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
      />
    </header>
  );
}
