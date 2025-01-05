"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import HeaderSideMenuLi from "app/ui/layout/header/header-side-menu-li";
import { FaArrowRight } from "react-icons/fa";
import { usePathname } from "next/navigation";

interface HeaderSideMenuProps {
  newReviewAlertState: boolean;
  userDisplayName: string;
  isOpen: boolean;
  onLogout: () => void;
  onClose: () => void;
}

export default function HeaderSideMenu({
  newReviewAlertState,
  userDisplayName,
  isOpen,
  onLogout,
  onClose,
}: HeaderSideMenuProps) {
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={sideMenuRef}
      className={`pointer-events-auto fixed right-0 top-0 z-[100] h-full w-2/3 transform bg-black text-gray-100 drop-shadow-lg transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="transition-colors hover:text-gray-500"
          aria-label="메뉴 열기"
        >
          <span className="sr-only">메뉴 열기</span>
          <IoMdClose size={24} aria-hidden />
        </button>
      </div>

      {/* My Page 메뉴 */}
      <div className="px-4">
        {userDisplayName ? (
          <div className="cursor-pointer">
            <button
              onClick={() => setMenuIsOpen(!menuIsOpen)}
              className="mb-2 flex w-full items-center justify-between border-b border-white pb-2 text-xs"
            >
              <span>{userDisplayName} 님</span>
              <div
                className={`px-1 transition-all duration-200 hover:text-gray-500 ${menuIsOpen ? "rotate-180" : ""}`}
              >
                <IoIosArrowDown size={16} />
              </div>
            </button>

            {/* Dropdown Menu */}
            <div
              className={`w-full overflow-hidden transition-all duration-300 ${menuIsOpen ? "mb-4 max-h-24 opacity-100" : "mb-2 max-h-0 opacity-0"} `}
            >
              <div className="flex items-center justify-between">
                <button
                  className="rounded-2xl border border-white px-4 py-2 text-xs transition-all duration-300 hover:bg-white hover:text-black"
                  onClick={onLogout}
                >
                  Logout
                </button>
                <Link href="/my-page">
                  <button
                    className="rounded-2xl border border-white bg-white px-4 py-2 text-xs font-bold text-black transition-all duration-300 hover:bg-black hover:text-white"
                    onClick={onClose}
                  >
                    My Page
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // 로그인 되어 있지 않은 경우 로그인 버튼 표시
          <Link href="/login">
            <div
              onClick={onClose}
              className="mb-2 flex w-full items-center justify-between rounded-2xl border border-white bg-white px-4 py-2 text-sm text-black transition-all duration-300 hover:bg-black hover:font-bold hover:text-white"
            >
              Login
              {pathname !== "/login" && <FaArrowRight />}
            </div>
          </Link>
        )}
      </div>
      <nav className="cursor-pointer px-4">
        <ul onClick={onClose} className="flex flex-col space-y-2">
          <HeaderSideMenuLi href="/">Home</HeaderSideMenuLi>
          <HeaderSideMenuLi href="/search">Search</HeaderSideMenuLi>
          <HeaderSideMenuLi href="/ticket-list" showAlert={newReviewAlertState}>
            Ticket List
          </HeaderSideMenuLi>
        </ul>
      </nav>
    </div>
  );
}
