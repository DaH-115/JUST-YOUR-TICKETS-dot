import React, { useCallback } from "react";
import Link from "next/link";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

interface TicketBtnGroupProps {
  postId: string;
  movieId: string;
  authorId: string;
  onReviewDeleted: (postId: string) => void;
}

const TicketBtnGroup = React.memo(function ReviewBtnGroup({
  postId,
  movieId,
  authorId,
  onReviewDeleted,
}: TicketBtnGroupProps) {
  const userState = useAppSelector((state) => state.userData.auth);

  // 현재 사용자가 리뷰 작성자인지 확인
  const isOwner = userState?.uid === authorId;

  // 삭제 핸들러
  const handleDelete = useCallback(() => {
    onReviewDeleted(postId);
  }, [onReviewDeleted, postId]);

  if (!isOwner) return null;

  return (
    <Menu as="div" className="relative">
      <MenuButton className="rounded-full bg-white p-2 transition hover:scale-110">
        <BsThreeDotsVertical className="text-gray-600" />
      </MenuButton>

      <MenuItems
        modal={false}
        transition
        className="absolute right-0 top-8 z-10 min-w-20 origin-top-right overflow-hidden rounded-lg border border-black bg-white shadow-md transition duration-200 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150"
      >
        <MenuItem>
          <Link
            href={`/write-review/${postId}?movieId=${movieId}`}
            className="flex w-full items-center justify-center border-b px-1 py-2 text-center text-sm transition-colors data-[focus]:bg-gray-100 data-[focus]:font-bold"
          >
            <div className="flex items-center justify-center rounded-md p-1">
              <MdOutlineEdit className="mr-1 text-lg" />
              수정
            </div>
          </Link>
        </MenuItem>

        <MenuItem>
          <button
            onClick={handleDelete}
            className="flex w-full items-center justify-center px-1 py-2 text-center text-sm text-red-600 transition-colors data-[focus]:bg-gray-100 data-[focus]:font-bold"
          >
            <div className="flex items-center justify-center rounded-md p-1">
              <MdDeleteOutline className="mr-1 text-lg text-red-500" />
              삭제
            </div>
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
});

export default TicketBtnGroup;
