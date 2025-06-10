import Link from "next/link";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";

interface HeaderDropDownMenuProps {
  dropdownRef: React.RefObject<HTMLDivElement>;
  userDisplayName: string | undefined;
  userPhotoURL: string | null | undefined;
  isDropdownOpen: boolean;
  dropDownHandler: () => void;
  logoutHandler: () => void;
}

export default function HeaderDropDownMenu({
  dropDownHandler,
  isDropdownOpen,
  logoutHandler,
  dropdownRef,
  userDisplayName,
  userPhotoURL,
}: HeaderDropDownMenuProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-3" onClick={dropDownHandler}>
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/20">
          {userPhotoURL ? (
            <Image
              src={`/api/s3?key=${encodeURIComponent(userPhotoURL)}`}
              alt={userDisplayName || "Guest"}
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-white">
              {userDisplayName ? userDisplayName.charAt(0).toUpperCase() : "G"}
            </span>
          )}
        </div>
        <button className="font-medium text-white">
          {userDisplayName ? userDisplayName : "Guest"} 님
        </button>
        <div
          className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
        >
          <IoIosArrowDown size={12} className="text-white" />
        </div>
      </div>
      <nav
        onClick={dropDownHandler}
        className={`absolute -right-4 top-full z-10 mt-4 flex min-w-40 cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-200 ease-out ${
          isDropdownOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <Link href="/my-page">
          <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-900">
            My Page
          </button>
        </Link>
        <div className="border-t border-gray-100">
          <button
            onClick={logoutHandler}
            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
