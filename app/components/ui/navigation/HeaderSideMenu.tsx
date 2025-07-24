"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import ProfileAvatar from "app/components/user/ProfileAvatar";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";

interface HeaderSideMenuProps {
  userDisplayName: string;
  userPhotoURL: string | null | undefined;
  userEmail: string;
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
  userEmail,
  isOpen,
  onClose,
}: HeaderSideMenuProps) {
  const user = useAppSelector(selectUser);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

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
          {user?.uid ? (
            <div className="flex items-center space-x-4">
              <ProfileAvatar
                userDisplayName={userDisplayName}
                s3photoKey={userPhotoURL || undefined}
                size={48}
                showLoading={true}
              />
              <div>
                <p className="text-lg font-medium text-white">
                  {userDisplayName}
                </p>
                <p className="text-xs text-gray-300">{userEmail}</p>
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
          {user?.uid && (
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
