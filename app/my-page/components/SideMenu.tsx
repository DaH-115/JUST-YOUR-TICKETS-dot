"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAppSelector } from "store/redux-toolkit/hooks";

const SideMenu = React.memo(function SideMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlUid = searchParams.get("uid");
  const userState = useAppSelector((state) => state.user.user);

  const getMenuStyle = useCallback(
    (path: string) => {
      const isCurrentPath = pathname === path;
      let isActive = false;

      if (path === "/my-page" && isCurrentPath && !urlUid) {
        isActive = true;
      } else if (
        path === "/my-page/my-ticket-list" &&
        isCurrentPath &&
        urlUid
      ) {
        isActive = true;
      }

      return `text-lg w-full text-center lg:text-start md:text-2xl lg:text-5xl ${
        isActive
          ? "text-accent-300  font-bold"
          : "text-gray-300 hover:text-[#BD9C31]"
      } transition-all duration-300 ease-in-out`;
    },
    [pathname, urlUid],
  );

  return (
    <nav className="hidden pr-8 lg:block">
      <Link href="/my-page" className="w-full">
        <div className={getMenuStyle("/my-page")}>MY PROFILE</div>
      </Link>
      <Link
        href={`/my-page/my-ticket-list?uid=${userState?.uid}`}
        className="w-full"
      >
        <div className={getMenuStyle("/my-page/my-ticket-list")}>
          MY TICKET LIST
        </div>
      </Link>
    </nav>
  );
});

export default SideMenu;
