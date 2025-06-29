"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { usePresignedUrl } from "app/hooks/usePresignedUrl";

interface HeaderSideMenuProps {
  userDisplayName: string;
  userPhotoURL: string | null | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/ticket-list", label: "Ticket List" },
];

export default function HeaderSideMenu({
  userDisplayName,
  userPhotoURL,
  isOpen,
  onClose,
}: HeaderSideMenuProps) {
  const userUid = useAppSelector((state) => state.userData.auth?.uid);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const { url: presignedUrl, loading } = usePresignedUrl({
    key: userPhotoURL,
  });

  // 클라이언트에서만 포털 렌더링
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 스크롤 방지
  useEffect(() => {
    if (!isMounted) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMounted]);

  // 서버에서는 렌더링하지 않음
  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-300 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black" onClick={onClose} />

      {/* 메뉴 패널 */}
      <div
        className={`fixed right-0 top-0 h-full w-full bg-black transition-transform duration-300 ease-out sm:w-80 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-white/20 p-6">
          <h2 className="text-2xl font-semibold text-white">메뉴</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white hover:bg-white/20"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* 사용자 프로필 */}
        <div className="border-b border-white/20 p-6">
          {userUid ? (
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 overflow-hidden rounded-full">
                {loading ? (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                  </div>
                ) : (
                  <Image
                    src={presignedUrl}
                    alt="프로필"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default-profile.svg";
                    }}
                  />
                )}
              </div>
              <div>
                <p className="text-lg font-medium text-white">
                  {userDisplayName}
                </p>
                <p className="text-base text-gray-400">환영합니다!</p>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="block w-full rounded-full bg-primary-600 py-4 text-center text-lg font-medium text-white hover:bg-primary-700"
            >
              로그인
            </Link>
          )}
        </div>

        {/* 메인 메뉴 */}
        <div className="p-6">
          <nav>
            <ul className="space-y-2">
              {menuItems.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className={`block w-full rounded-full px-6 py-4 text-left text-lg ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 사용자 메뉴 */}
          {userUid && (
            <div className="mt-8 border-t border-white/20 pt-6">
              <h3 className="mb-4 text-base font-medium text-gray-400">
                My Menu
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/my-page"
                    onClick={onClose}
                    className="block w-full rounded-full px-6 py-3 text-left text-base text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-page/my-ticket-list"
                    onClick={onClose}
                    className="block w-full rounded-full px-6 py-3 text-left text-base text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    My Tickets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-page/liked-ticket-list"
                    onClick={onClose}
                    className="block w-full rounded-full px-6 py-3 text-left text-base text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    Liked Reviews
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
