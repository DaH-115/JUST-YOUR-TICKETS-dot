import { useEffect, useRef } from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";

interface HeaderSideMenuProps {
  newReviewAlertState: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function HeaderSideMenu({
  newReviewAlertState,
  isOpen,
  onClose,
}: HeaderSideMenuProps) {
  const sideMenuRef = useRef<HTMLDivElement>(null);

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
      className={`pointer-events-auto fixed right-0 top-0 z-50 h-full w-64 transform bg-black drop-shadow-lg transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="text-gray-100 transition-colors duration-300 hover:text-gray-700"
        >
          <IoMdClose size={24} />
        </button>
      </div>
      <nav className="px-4">
        <ul onClick={onClose}>
          <li className="px-4 py-2">
            <Link
              href="/"
              className="text-lg text-gray-100 transition-colors duration-300 hover:text-gray-500"
            >
              Home
            </Link>
          </li>
          <li className="px-4 py-2">
            <Link
              href="/search"
              className="text-lg text-gray-100 transition-colors duration-300 hover:text-gray-500"
            >
              Search
            </Link>
          </li>
          <li className="px-4 py-2">
            <Link
              href="/ticket-list"
              className="text-lg text-gray-100 transition-colors duration-300 hover:text-gray-500"
            >
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
