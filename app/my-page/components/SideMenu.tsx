"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  path: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { path: "/my-page", label: "MY PROFILE" },
  { path: "/my-page/my-ticket-list", label: "MY TICKET LIST" },
  { path: "/my-page/liked-ticket-list", label: "LIKED TICKET LIST" },
];

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-1/4 space-y-2 pr-4 lg:block">
      {menuItems.map(({ path, label }) => {
        const isActive = pathname === path;

        return (
          <div key={path} className="w-full">
            <Link
              href={path}
              className={`block w-full text-center text-lg transition-all duration-300 ease-in-out md:text-2xl lg:text-start ${
                isActive
                  ? "font-bold text-accent-300"
                  : "text-gray-300 hover:text-accent-300"
              } `}
            >
              {label}
            </Link>
          </div>
        );
      })}
    </aside>
  );
}
