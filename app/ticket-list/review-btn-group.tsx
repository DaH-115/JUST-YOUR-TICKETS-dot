import React, { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { db } from "firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useAppSelector } from "store/hooks";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

interface ReviewBtnGroupProps {
  postId: string;
  movieId: string;
  onReviewDeleted: (postId: string) => void;
}

const ReviewBtnGroup = React.memo(function ReviewBtnGroup({
  postId,
  movieId,
  onReviewDeleted,
}: ReviewBtnGroupProps) {
  const userState = useAppSelector((state) => state.user.user);
  const [isOwnership, setIsOwnership] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 권한 검사 함수
  const checkOwnership = useCallback(async () => {
    if (!userState?.uid || !postId) return;

    try {
      const reviewDoc = await getDoc(doc(db, "movie-reviews", postId));
      if (reviewDoc.exists()) {
        const reviewData = reviewDoc.data();
        setIsOwnership(reviewData.userUid === userState.uid);
      }
    } catch (error) {
      setIsOwnership(false);
    }
  }, [postId, userState?.uid]);

  useEffect(() => {
    checkOwnership();
  }, [checkOwnership]);

  // 삭제 핸들러
  const handleDelete = useCallback(() => {
    onReviewDeleted(postId);
    setIsOpen(false);
  }, [onReviewDeleted, postId]);

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

  if (!isOwnership) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 드롭다운 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full border border-black bg-white p-1.5 hover:bg-gray-100 focus:outline-none"
        aria-label="메뉴 열기"
      >
        <BsThreeDotsVertical className="text-gray-600" />
      </button>

      {/* 드롭다운 메뉴 */}
      <div
        className={`absolute right-0 top-8 z-10 min-w-[80px] rounded-lg border border-black bg-white drop-shadow-md ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {/* 수정 버튼 */}
        <Link
          href={`/write-review/${postId}?movieId=${movieId}`}
          className="block p-1 text-center text-sm text-gray-700 transition-all hover:scale-105 hover:transform hover:font-bold"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-center rounded-md p-1 hover:bg-gray-100">
            <span className="mr-1">
              <MdOutlineEdit className="text-lg text-gray-600" />
            </span>
            수정
          </div>
        </Link>
        {/* 삭제 버튼 */}
        <button
          onClick={handleDelete}
          className="block w-full p-1 text-center text-sm text-red-600 transition-all hover:scale-105 hover:transform hover:font-bold"
        >
          <div className="flex items-center justify-center rounded-md p-1 hover:bg-gray-100">
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

export default ReviewBtnGroup;
