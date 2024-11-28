"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";

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
      <div className="flex justify-end p-4 pb-0">
        <button
          onClick={onClose}
          className="text-gray-100 transition-colors hover:text-gray-500"
        >
          <IoMdClose size={24} />
        </button>
      </div>

      <div className="px-4">
        {userDisplayName ? (
          <div className="cursor-pointer">
            <button
              onClick={() => setMenuIsOpen(!menuIsOpen)}
              className="mb-2 flex w-full items-center border-b border-white pb-2 text-sm"
            >
              <span>{userDisplayName} 님</span>
              <div
                className={`px-2 text-gray-100 transition-all duration-200 hover:text-gray-500 ${menuIsOpen ? "rotate-180" : ""}`}
              >
                <IoIosArrowDown size={16} />
              </div>
            </button>

            {/* Dropdown Menu */}
            <div
              className={`w-full overflow-hidden transition-all duration-300 ${menuIsOpen ? "mb-6 max-h-24 opacity-100" : "mb-0 max-h-0 opacity-0"} `}
            >
              <div className="flex items-center justify-between">
                <Link href="/my-page">
                  <button
                    className="w-24 rounded-2xl border border-white bg-white px-4 py-2 text-xs text-black transition-all duration-300 hover:bg-black hover:font-bold hover:text-white"
                    onClick={onClose}
                  >
                    My Page
                  </button>
                </Link>
                <button
                  className="w-24 rounded-2xl border border-white px-4 py-2 text-xs transition-all duration-300 hover:bg-white hover:font-bold hover:text-black"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="my-2 block rounded-xl border border-white bg-white px-2 py-1 text-sm text-black transition-all duration-300 hover:bg-black hover:font-bold hover:text-gray-100 md:rounded-2xl md:px-6 md:py-4"
            onClick={onClose}
          >
            Login
          </Link>
        )}
      </div>
      <nav className="cursor-pointer px-4">
        <ul onClick={onClose} className="flex flex-col space-y-2">
          <Link
            href="/"
            className="inline-block rounded-2xl border border-white px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:font-bold hover:text-black md:rounded-2xl md:px-6 md:py-4"
          >
            <li>Home</li>
          </Link>
          <li className="inline-block rounded-2xl border border-white px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:font-bold hover:text-black md:rounded-2xl md:px-6 md:py-4">
            <Link href="/search">Search</Link>
          </li>
          <li className="inline-block rounded-2xl border border-white px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:font-bold hover:text-black md:rounded-2xl md:px-6 md:py-4">
            <Link href="/ticket-list">
              Ticket List
              {newReviewAlertState && (
                <span className="absolute right-2 top-2 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
