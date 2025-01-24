import Link from "next/link";

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
      <button className="px-4 font-bold" onClick={dropDownHandler}>
        {userDisplayName ? userDisplayName : "Guest"} 님
      </button>
      <nav
        onClick={dropDownHandler}
        className={`absolute -right-7 top-full z-10 flex min-w-32 cursor-pointer flex-col items-center justify-center whitespace-nowrap rounded-xl border border-black bg-white shadow-lg transition-all duration-300 ${
          isDropdownOpen
            ? "pointer-events-auto translate-y-5 opacity-100"
            : "pointer-events-none translate-y-0 opacity-0"
        }`}
      >
        <div className="w-full p-1">
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
