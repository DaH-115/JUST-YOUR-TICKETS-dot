import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

interface HeaderDropDownMenuProps {
  dropdownRef: React.RefObject<HTMLDivElement>;
  userDisplayName: string | undefined;
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
}: HeaderDropDownMenuProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center" onClick={dropDownHandler}>
        <button className="pl-4 font-bold">
          {userDisplayName ? userDisplayName : "Guest"} 님
        </button>
        <div className={`px-1 ${isDropdownOpen ? "rotate-180" : ""}`}>
          <IoIosArrowDown size={12} />
        </div>
      </div>
      <nav
        onClick={dropDownHandler}
        className={`absolute -right-7 top-full z-10 flex min-w-32 cursor-pointer flex-col items-center justify-center whitespace-nowrap rounded-xl border border-black bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isDropdownOpen
            ? "pointer-events-auto translate-y-5 opacity-100"
            : "pointer-events-none translate-y-0 opacity-0"
        }`}
      >
        <div className="w-full border-b-2 border-gray-200 p-1">
          <Link href="/my-page">
            <button className="w-full rounded-xl px-4 py-2 transition-all duration-300 hover:bg-gray-200 hover:font-bold">
              My Page
            </button>
          </Link>
        </div>
        <div className="w-full p-1">
          <button
            onClick={logoutHandler}
            className="w-full rounded-xl px-4 py-2 transition-all duration-300 hover:bg-gray-200 hover:font-bold"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
