"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "store/redux-toolkit/hooks";

export default function SideMenu() {
  const pathname = usePathname();
  const uid = useAppSelector((state) => state.userData.auth?.uid);

  const getMenuStyle = (targetPath: string) =>
    `text-lg w-full text-center lg:text-start md:text-2xl lg:text-4xl ${
      pathname === targetPath
        ? "text-accent-300 font-bold"
        : "text-gray-300 hover:text-[#BD9C31]"
    } transition-all duration-300 ease-in-out`;

  return (
    <aside className="hidden w-1/2 space-y-2 pr-0 lg:block">
      <div className={getMenuStyle("/my-page")}>
        <Link href="/my-page">MY PROFILE</Link>
      </div>
      <div className={getMenuStyle("/my-page/my-ticket-list")}>
        <Link href={`/my-page/my-ticket-list?uid=${uid}`}>MY TICKET LIST</Link>
      </div>
      <div
        className={getMenuStyle("/my-page/my-ticket-list/liked-ticket-list")}
      >
        <Link href={`/my-page/my-ticket-list/liked-ticket-list?uid=${uid}`}>
          LIKED
        </Link>
      </div>
      <div
        className={getMenuStyle(
          "/my-page/my-ticket-list/bookmarked-ticket-list",
        )}
      >
        <Link
          href={`/my-page/my-ticket-list/bookmarked-ticket-list?uid=${uid}`}
        >
          BOOKMARKED
        </Link>
      </div>
    </aside>
  );
}
