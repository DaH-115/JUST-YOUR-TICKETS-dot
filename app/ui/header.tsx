"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { signOut } from "firebase/auth";
import { isAuth } from "firebase-config";
import { useRouter } from "next/navigation";
import { clearUserState } from "store/userSlice";
import HeaderSearchBar from "app/ui/header-search-bar";
import { IoIosMenu } from "react-icons/io";
import HeaderSideMenu from "app/ui/header-side-menu";

export default function Header() {
  const router = useRouter();
  const newReviewAlertState = useAppSelector(
    (state) => state.newReviewAlert.newReviewAlertState,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const users = useAppSelector((state) => state.user.user);
  const userDisplayName = users?.displayName;
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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

  const toggleSideMenu = () => {
    setIsSideMenuOpen((prev) => !prev);
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
      className={`relative z-10 flex w-full items-center justify-center px-2 py-4 lg:px-8 lg:pt-8 ${
        isSideMenuOpen ? "pointer-events-none" : ""
      }`}
    >
      <div
        className={`flex w-full items-center justify-between rounded-full border border-black bg-white lg:w-auto lg:justify-center lg:border-2 lg:px-4 lg:py-3 ${
          isSideMenuOpen ? "pointer-events-auto" : ""
        }`}
      >
        {/* LOGO */}
        <h1 className="ml-1 px-4 py-2 text-sm font-bold text-gray-700 lg:px-4 lg:py-0">
          just your tickets.
        </h1>
        {/* MENU */}
        <ul className="hidden lg:flex">
          <li className="group">
            <Link
              href="/"
              className="rounded-full px-4 py-2 transition-all duration-500 ease-in-out hover:bg-gray-200"
            >
              Home
            </Link>
          </li>
          <li className="group relative">
            <Link
              href="/search"
              className="rounded-full px-4 py-2 transition-all duration-500 ease-in-out hover:bg-gray-200"
            >
              Search
            </Link>
          </li>
          <li className="group relative">
            <Link
              href="/ticket-list"
              className="group relative rounded-full px-4 py-2 transition-all duration-500 ease-in-out hover:bg-gray-200"
            >
              Ticket List
              {newReviewAlertState && (
                <span className="absolute right-1 top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                </span>
              )}
            </Link>
          </li>
        </ul>
        {/* MOBILE/ HAMBURGER MENU */}
        <div
          onClick={toggleSideMenu}
          className={`block rounded-full px-4 py-2 transition-colors duration-300 active:bg-gray-200 lg:hidden ${
            isSideMenuOpen ? "pointer-events-auto" : ""
          }`}
        >
          <IoIosMenu size={34} />
        </div>
        {/* PROFILE MENU */}
        <div className="hidden lg:flex">
          {userDisplayName ? (
            <div className="relative" ref={dropdownRef}>
              <button className="ml-4 font-bold" onClick={dropDownHandler}>
                {userDisplayName ? userDisplayName : "Guest"} 님
              </button>

              <div
                onClick={dropDownHandler}
                className={`absolute -right-10 top-full z-10 flex w-[150px] cursor-pointer flex-col items-center justify-center whitespace-nowrap rounded-xl border-2 border-black bg-white shadow-lg transition-all duration-300 ${
                  isDropdownOpen
                    ? "pointer-events-auto translate-y-5 opacity-100"
                    : "pointer-events-none translate-y-0 opacity-0"
                }`}
              >
                <div className="w-full p-1">
                  <Link href="/my-page">
                    <button className="w-full rounded-xl px-4 py-2 transition-all duration-300 hover:bg-gray-200 hover:font-bold">
                      My Page
                    </button>
                  </Link>
                </div>
                <div className="w-full p-1">
                  <button
                    onClick={logoutHandler}
                    className="w-full rounded-xl px-4 py-2 transition-all duration-300 hover:bg-gray-200 hover:font-bold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
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
      <HeaderSideMenu
        newReviewAlertState={newReviewAlertState}
        userDisplayName={userDisplayName || ""}
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
      />
    </header>
  );
}
