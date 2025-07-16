"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

interface HeaderSideMenuLiProps {
  href: string;
  children: React.ReactNode;
}

export default function HeaderSideMenuLi({
  href,
  children,
}: HeaderSideMenuLiProps) {
  const pathname = usePathname();
  const isCurrentPage = pathname === href;

  return (
    <li className="rounded-full transition-all duration-300 hover:bg-white hover:font-bold hover:text-black">
      <Link
        href={href}
        className="block w-full rounded-full border border-white px-4 py-2"
      >
        <div className="relative flex items-center justify-between">
          {children}
          {!isCurrentPage && <FaArrowRight aria-hidden />}
        </div>
      </Link>
    </li>
  );
}
