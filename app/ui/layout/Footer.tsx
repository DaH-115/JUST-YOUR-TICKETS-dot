"use client";

import Link from "next/link";
import { useAppSelector } from "store/redux-toolkit/hooks";

export default function Footer() {
  const userUid = useAppSelector((state) => state.userData.auth?.uid);

  const borderStyle =
    "border-b-2 border-transparent transition duration-300 hover:border-white";

  return (
    <footer className="w-full bg-primary-700 p-8 pt-6 text-xs text-white md:p-8">
      <div className="flex justify-between space-x-2">
        <div className="flex h-40 w-full flex-col justify-between">
          <div className="font-bold">Just Your Tickets.</div>
          <div>{`ⓒGWAK DA HYUN 2022 - ${new Date().getFullYear()}`}</div>
        </div>
        <nav className="w-full border-l-2 border-dotted border-gray-500 pl-4">
          <ul className="space-y-1">
            <li className={borderStyle}>
              <Link href="/" className="block p-1">
                Home
              </Link>
            </li>
            <li className={borderStyle}>
              <Link href="/search" className="block p-1">
                Search
              </Link>
            </li>
            <li className={borderStyle}>
              <Link href="/ticket-list" className="block p-1">
                Ticket List
              </Link>
            </li>
            <li className={borderStyle}>
              <Link href="/my-page" className="block p-1">
                My Page
              </Link>
            </li>
            <li className={borderStyle}>
              <Link
                href={`/my-page/my-ticket-list?uid=${userUid}`}
                className="block p-1"
              >
                My Ticket List
              </Link>
            </li>
          </ul>
        </nav>
        <div className="w-full border-l-2 border-dotted border-gray-500 pl-4">
          <Link
            href="https://zippy-position-4e4.notion.site/Dahyun-Gwak-45235441d63641798c44ee9d7ed607f5"
            className={`block p-1 ${borderStyle}`}
          >
            Resume
          </Link>
          <Link
            href="https://github.com/DaH-115/JUST-MOVIE-TICKETS-dot"
            className={`block p-1 ${borderStyle}`}
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
