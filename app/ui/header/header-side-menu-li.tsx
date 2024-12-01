"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

interface HeaderSideMenuLiProps {
  href: string;
  children: React.ReactNode;
  showAlert?: boolean;
}

export default function HeaderSideMenuLi({
  href,
  children,
  showAlert,
}: HeaderSideMenuLiProps) {
  const pathname = usePathname();
  const isCurrentPage = pathname === href;

  return (
    <li className="inline-block rounded-2xl border border-white px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:font-bold hover:text-black md:rounded-2xl md:px-6 md:py-4">
      <Link href={href}>
        <div className="flex items-center justify-between">
          {children}
          {/* 리뷰가 새롭게 추가 되면 알림 표시 */}
          {showAlert && (
            <span className="absolute right-2 top-2 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            </span>
          )}
          {!isCurrentPage && <FaArrowRight className="ml-1" />}
        </div>
      </Link>
    </li>
  );
}
