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

    return `w-full text-center lg:text-start ${
      isActive
        ? "text-lg text-black md:text-5xl font-bold"
        : "text-lg text-gray-300 hover:text-black md:text-5xl"
    } transition-all duration-300 ease-in-out`;
  };

  return (
    <nav className="mb-4 flex w-full flex-row lg:mb-0 lg:mr-6 lg:w-2/4 lg:flex-col">
      <Link href="/my-page" className="w-full">
        <div className={getMenuStyle("/my-page")}>MY PROFILE</div>
      </Link>
      <Link href={`/my-page/my-ticket-list?uid=${uid}`} className="w-full">
        <div className={getMenuStyle("/my-page/my-ticket-list")}>
          MY TICKET LIST
        </div>
      </Link>
    </nav>
  );
}
