"use client";

import Link from "next/link";
import { useAppSelector } from "store/hooks";
import HeaderSearchBar from "app/ui/header-search-bar";

export default function Header() {
  const newReviewAlertState = useAppSelector(
    (state) => state.newReviewAlert.newReviewAlertState,
  );

  return (
    <header className="fixed left-0 top-0 z-50 flex w-full items-center px-8 py-4">
      {/* RIGHT SIDE */}
      <div className="flex-1">
        {/* LOGO */}
        <div className="flex font-bold">just your tickets.</div>
      </div>
      {/* MENU */}
      <ul className="mr-6 hidden items-center space-x-4 font-bold md:flex">
        <li className="group relative">
          <Link
            href="/"
            className="transition-colors group-hover:text-orange-500"
          >
            Home
          </Link>
          <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-orange-500 transition-transform group-hover:scale-x-100 group-focus:scale-x-100"></span>
        </li>
        <li className="group relative">
          {/* ADD SIGN ALERT */}
          <Link
            href="/ticket-list"
            className={`whitespace-nowrap rounded-full border-2 transition-colors group-hover:text-orange-500 ${newReviewAlertState ? "border-red-700 px-4 py-2" : "border-none"}`}
          >
            Ticket List
          </Link>
          {!newReviewAlertState ? (
            <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-orange-500 transition-transform group-hover:scale-x-100 group-focus:scale-x-100"></span>
          ) : null}
        </li>
        <li className="group relative">
          <Link
            href="/search"
            className="transition-colors group-hover:text-orange-500"
          >
            Search
          </Link>
          <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-orange-500 transition-transform group-hover:scale-x-100 group-focus:scale-x-100"></span>
        </li>
      </ul>
      {/* MOBILE MENU */}
      <div className="mr-4 flex items-center justify-center md:hidden">
        메뉴
      </div>

      {/* LEFT SIDE */}
      {/* SEARCH BAR */}
      <HeaderSearchBar />

      <Link href="/login">
        <button
          type="button"
          className="rounded-full bg-black px-3 py-2 text-sm font-bold text-white transition-colors duration-200 ease-in-out hover:bg-yellow-600"
        >
          로그인
        </button>
      </Link>
    </header>
  );
}
