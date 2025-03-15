"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import HeaderSideMenuLi from "app/ui/layout/header/components/HeaderSideMenuLi";
import { FaArrowRight } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useAppSelector } from "store/redux-toolkit/hooks";

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
  const userUid = useAppSelector((state) => state.user.user?.uid);
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

  const toggleMenuHandler = useCallback(() => {
    setMenuIsOpen((prev) => !prev);
  }, []);

  return (
    <div
      ref={sideMenuRef}
      className={`pointer-events-auto fixed right-0 top-0 z-[100] h-full w-2/3 transform bg-black text-gray-100 drop-shadow-lg transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4 pb-8">
        <button
          onClick={onClose}
          className="transition-colors hover:text-accent-300"
          aria-label="메뉴 닫기"
        >
          <IoMdClose size={24} aria-hidden />
        </button>
      </div>

      {/* My Page 메뉴 */}
      <div className="px-4">
        {userDisplayName ? (
          <div className="cursor-pointer">
            {/* Dropdown Button */}
            <button
              onClick={toggleMenuHandler}
              className="mb-2 flex w-full items-center justify-between border-b border-white pb-2"
            >
              <div className="text-sm">
                <span className="font-bold">{userDisplayName}</span>님
              </div>
              <div className={`px-1 ${menuIsOpen ? "rotate-180" : ""}`}>
                <IoIosArrowDown size={16} />
              </div>
            </button>

            {/* Dropdown Menu */}
            <div
              className={`transition-all duration-300 ease-in-out ${menuIsOpen ? "pointer-events-auto mb-4 max-h-36 opacity-100" : "pointer-events-none mb-2 max-h-0 opacity-0"} `}
            >
              <div className="space-y-2 text-sm">
                <Link
                  href="/my-page"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-full border border-white bg-white px-4 py-2 text-black transition-all duration-300 hover:bg-black hover:font-bold hover:text-white"
                >
                  My Page
                  {pathname !== "/my-page" && <FaArrowRight aria-hidden />}
                </Link>
                <Link
                  href={`/my-page/my-ticket-list?uid=${userUid}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-full border border-white bg-white px-4 py-2 text-black transition-all duration-300 hover:bg-black hover:font-bold hover:text-white"
                >
                  My Ticket List
                  {pathname !== "/my-page/my-ticket-list" && (
                    <FaArrowRight aria-hidden />
                  )}
                </Link>
                <button
                  className="rounded-full border border-white px-4 py-2 transition-all duration-300 hover:bg-white hover:font-bold hover:text-black"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          // 로그인 되어 있지 않은 경우 로그인 화면 이동 버튼 표시
          <Link
            href="/login"
            onClick={onClose}
            className="mb-2 flex w-full items-center justify-between rounded-full border border-white bg-white p-3 text-black transition-all duration-300 hover:bg-black hover:font-bold hover:text-white"
          >
            Login
            {pathname !== "/login" && <FaArrowRight aria-hidden />}
          </Link>
        )}
      </div>
      <nav className="cursor-pointer px-4 text-sm">
        <ul onClick={onClose} className="flex flex-col space-y-2">
          <HeaderSideMenuLi href={"/"}>Home</HeaderSideMenuLi>
          <HeaderSideMenuLi href={"/search"}>Search</HeaderSideMenuLi>
          <HeaderSideMenuLi
            href={"/ticket-list"}
            showAlert={newReviewAlertState}
          >
            Ticket List
          </HeaderSideMenuLi>
        </ul>
      </nav>
    </div>
  );
}
