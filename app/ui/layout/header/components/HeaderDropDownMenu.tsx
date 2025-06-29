"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { usePresignedUrl } from "app/hooks/usePresignedUrl";

interface HeaderDropDownMenuProps {
  userDisplayName: string | undefined;
  userPhotoURL: string | null | undefined;
  logoutHandler: () => void;
}

export default function HeaderDropDownMenu({
  userDisplayName,
  userPhotoURL,
  logoutHandler,
}: HeaderDropDownMenuProps) {
  const [imageError, setImageError] = useState(false);
  const { url: presignedUrl, loading } = usePresignedUrl({
    key: userPhotoURL,
  });

  // userPhotoURL이 있는지 여부로 이미지 표시 결정
  const shouldShowImage =
    userPhotoURL &&
    typeof userPhotoURL === "string" &&
    userPhotoURL.trim().length > 0 &&
    !imageError;

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-3 transition-opacity hover:opacity-80">
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/20">
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent"></div>
          ) : shouldShowImage ? (
            <Image
              src={presignedUrl}
              alt={userDisplayName || "Guest"}
              fill
              sizes="32px"
              className="object-cover"
              onError={(e) => {
                console.warn(
                  `헤더 프로필 이미지 로딩 실패: ${userDisplayName}`,
                  e.currentTarget.src,
                  e.type,
                );
                setImageError(true);
              }}
            />
          ) : (
            <span className="text-sm font-bold text-white">
              {userDisplayName ? userDisplayName.charAt(0).toUpperCase() : "G"}
            </span>
          )}
        </div>
        <span className="font-medium text-white">
          {userDisplayName ? userDisplayName : "Guest"} 님
        </span>
        <IoIosArrowDown
          size={12}
          className="text-white transition-transform data-[open]:rotate-180"
        />
      </MenuButton>

      <MenuItems
        modal={false}
        transition
        className="absolute -right-4 top-full z-10 mt-4 min-w-40 origin-top overflow-hidden rounded-lg bg-white shadow-xl transition duration-200 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150"
      >
        <MenuItem>
          <Link
            href="/my-page"
            className="block w-full px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors data-[focus]:bg-gray-50 data-[focus]:text-gray-900"
          >
            My Page
          </Link>
        </MenuItem>

        <div className="border-t border-gray-100">
          <MenuItem>
            <button
              onClick={logoutHandler}
              className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors data-[focus]:bg-gray-50 data-[focus]:text-red-600"
            >
              Logout
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
