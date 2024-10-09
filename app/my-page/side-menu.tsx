"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function SideMenu({ uid }: { uid: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlUid = searchParams.get("uid");

  const getMenuStyle = (path: string) => {
    const isCurrentPath = pathname === path;

    let isActive = false;

    if (path === "/my-page" && isCurrentPath && !urlUid) {
      isActive = true;
    } else if (path === "/my-page/my-ticket-list" && isCurrentPath && urlUid) {
      isActive = true;
    }

    return isActive
      ? "text-4xl text-black md:text-8xl transition-all duration-300 ease-in-out"
      : "text-2xl text-gray-300 hover:text-black md:text-8xl transition-all duration-300 ease-in-out";
  };

  return (
    <div className="w-full flex-1 pr-8">
      <Link href="/my-page">
        <div className={getMenuStyle("/my-page")}>PROFILE</div>
      </Link>
      <Link href={`/my-page/my-ticket-list?uid=${uid}`}>
        <div className={getMenuStyle("/my-page/my-ticket-list")}>
          MY TICKET LIST
        </div>
      </Link>
    </div>
  );
}
