import React, { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

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
  const userState = useAppSelector((state) => state.user.user);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // 현재 사용자가 리뷰 작성자인지 확인
  const isOwner = userState?.uid === authorId;

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // 삭제 핸들러
  const handleDelete = useCallback(() => {
    onReviewDeleted(postId);
    setIsOpen(false);
  }, [onReviewDeleted, postId]);

  if (!isOwner) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* DROPDOWN MENU TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-white p-2 transition hover:scale-110"
        aria-label="메뉴 열기"
      >
        <BsThreeDotsVertical className="text-gray-600" />
      </button>
      {/* DROPDOWN MENU */}
      <div
        className={`absolute right-0 top-8 z-10 min-w-20 rounded-lg border border-black bg-white text-black drop-shadow-md ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {/* UPDATE BUTTON */}
        <Link
          href={`/write-review/${postId}?movieId=${movieId}`}
          className="inline-block w-full border-b border-gray-300 px-1 py-2 text-center text-sm"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-center rounded-md p-1 transition-colors ease-in-out hover:bg-gray-100 hover:font-bold">
            <span className="mr-1">
              <MdOutlineEdit className="text-lg" />
            </span>
            수정
          </div>
        </Link>
        {/* DELETE BUTTON */}
        <button
          onClick={handleDelete}
          className="w-full px-1 py-2 text-center text-sm text-red-600"
        >
          <div className="flex items-center justify-center rounded-md p-1 transition-colors ease-in-out hover:bg-gray-100 hover:font-bold">
            <span className="mr-1">
              <MdDeleteOutline className="text-lg text-red-500" />
            </span>
            삭제
          </div>
        </button>
      </div>
    </div>
  );
});

export default TicketBtnGroup;
