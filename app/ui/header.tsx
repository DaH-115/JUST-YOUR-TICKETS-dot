"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { signOut } from "firebase/auth";
import { isAuth } from "firebase-config";
import { useRouter } from "next/navigation";
import { clearUserState } from "store/userSlice";
import HeaderSearchBar from "app/ui/header-search-bar";
import GlowingCircle from "app/ui/glowing-circle";

export default function Header() {
  const router = useRouter();
  const newReviewAlertState = useAppSelector(
    (state) => state.newReviewAlert.newReviewAlertState,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDisplayName = useAppSelector(
    (state) => state.user.user?.displayName,
  );
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await signOut(isAuth);
      dispatch(clearUserState());
      router.push("/");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  const dropDownHandler = () => {
    setIsDropdownOpen((prev) => !prev);
  };

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
  }, []);

  return (
    <header className="relative z-50 flex w-full items-center justify-center pt-8">
      <div className="mr-4 flex items-center justify-center rounded-full border border-black bg-white px-4 py-2 shadow-md">
        {/* LOGO */}
        <div className="ml-2 font-bold">just your tickets.</div>
        {/* MENU */}
        <ul className="mx-12 flex text-sm">
          <li className="group">
            <Link
              href="/"
              className="rounded-full px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-100"
            >
              Home
            </Link>
          </li>
          <li className="group relative">
            <Link
              href="/search"
              className="rounded-full px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-100"
            >
              Search
            </Link>
          </li>
          <li className="group relative">
            <Link
              href="/ticket-list"
              className="rounded-full px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-100"
            >
              Ticket List
            </Link>
            {newReviewAlertState && <GlowingCircle />}
          </li>
        </ul>
        {/* MOBILE MENU */}
        <div className="mr-2 flex items-center justify-center md:hidden">
          메뉴
        </div>
        {userDisplayName ? (
          <div className="relative font-bold" ref={dropdownRef}>
            <button onClick={dropDownHandler}>
              {userDisplayName ? userDisplayName : "Guest"} 님
            </button>

            <div
              onClick={dropDownHandler}
              className={`absolute -right-10 top-full z-10 flex w-[150px] cursor-pointer flex-col items-center justify-center whitespace-nowrap rounded-xl border border-gray-300 bg-white shadow-lg transition-all duration-300 ${
                isDropdownOpen
                  ? "pointer-events-auto translate-y-5 opacity-100"
                  : "pointer-events-none translate-y-0 opacity-0"
              }`}
            >
              <div className="w-full p-1">
                <Link href="/my-page">
                  <button className="w-full rounded-xl px-4 py-2 font-bold hover:bg-gray-100">
                    My Page
                  </button>
                </Link>
              </div>
              <div className="w-full p-1">
                <button
                  onClick={logoutHandler}
                  className="w-full rounded-xl px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <button
              type="button"
              className="rounded-full bg-black px-3 py-2 text-sm font-bold text-white transition-colors duration-200 ease-in-out hover:bg-yellow-600"
            >
              로그인
            </button>
          </Link>
        )}
      </div>
      {/* SEARCH BAR */}
      <HeaderSearchBar />
    </header>
  );
}
