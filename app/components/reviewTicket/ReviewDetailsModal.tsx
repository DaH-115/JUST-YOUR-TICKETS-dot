import { useEffect, useState } from "react";
import { Review } from "api/reviews/fetchReviews";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { IoCloseOutline, IoStar } from "react-icons/io5";
import ReviewBtnGroup from "app/components/reviewTicket/TicketBtnGroup";
import formatDate from "app/utils/formatDate";
import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebase-config";
import { useAppSelector } from "store/redux-toolkit/hooks";

type ReviewDetailsModalProps = {
  isModalOpen: boolean;
  selectedReview: Review;
  closeModalHandler: () => void;
  onReviewDeleted: (id: string) => void;
};

export default function ReviewDetailsModal({
  closeModalHandler,
  onReviewDeleted,
  isModalOpen,
  selectedReview,
}: ReviewDetailsModalProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(selectedReview.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const userState = useAppSelector((state) => state.userData.auth);

  useEffect(() => {
    if (!userState?.uid) return;

    const checkStatus = async () => {
      const likeRef = doc(
        db,
        "users",
        userState.uid,
        "liked-reviews",
        selectedReview.id,
      );
      const bookmarkRef = doc(
        db,
        "users",
        userState.uid,
        "bookmarked-reviews",
        selectedReview.id,
      );

      const [likeSnap, bookmarkSnap] = await Promise.all([
        getDoc(likeRef),
        getDoc(bookmarkRef),
      ]);

      setLiked(likeSnap.exists());
      setBookmarked(bookmarkSnap.exists());
    };

    if (userState.uid && selectedReview.id) {
      checkStatus();
    }
  }, [userState?.uid, selectedReview.id]);

  const likeHandler = async () => {
    if (!userState?.uid || isLiking) return;
    setIsLiking(true);

    const likeRef = doc(
      db,
      "users",
      userState.uid,
      "liked-reviews",
      selectedReview.id,
    );
    const reviewRef = doc(db, "movie-reviews", selectedReview.id);
    const likeSnap = await getDoc(likeRef);

    if (likeSnap.exists()) {
      // 좋아요한 기록이 있으면 취소
      await deleteDoc(likeRef);
      await updateDoc(reviewRef, { likeCount: increment(-1) });
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      // 좋아요한 기록이 없다면 추가
      await setDoc(likeRef, {
        likedAt: serverTimestamp(),
      });
      await updateDoc(reviewRef, { likeCount: increment(1) });
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }

    setIsLiking(false);
  };

  const bookmarkHandler = async () => {
    if (!userState?.uid) return;
    setIsBookmarking(true);

    const bookmarkRef = doc(
      db,
      "users",
      userState.uid,
      "bookmarked-reviews",
      selectedReview.id,
    );
    const bookmarkSnap = await getDoc(bookmarkRef);

    if (bookmarkSnap.exists()) {
      // 북마크가 이미 되어있다면 삭제
      await deleteDoc(bookmarkRef);
      setBookmarked(false);
    } else {
      // 북마크가 되어있지 않다면 추가
      await setDoc(bookmarkRef, {
        bookmarkedAt: serverTimestamp(),
      });
      setBookmarked(true);
    }
    setIsBookmarking(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 shadow-lg transition-all duration-300 ${
        isModalOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`absolute w-11/12 rounded-2xl bg-white drop-shadow-lg transition-all duration-500 lg:w-2/5 ${
          isModalOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-full opacity-0"
        }`}
      >
        <div className="flex w-full items-center justify-between p-4">
          {/* 왼쪽: 별점 영역 */}
          <div className="mr-4 flex h-full items-center justify-center">
            <IoStar className="mr-1 text-accent-300" size={18} />
            <p className="text-2xl font-bold md:text-3xl">
              {selectedReview.rating}
            </p>
          </div>
          {/* 오른쪽: 타이틀 및 버튼 */}
          <div className="w-full">
            <h1 className="font-bold">{selectedReview?.reviewTitle}</h1>
            <div className="flex text-xs text-gray-500">
              {selectedReview.movieTitle} - {selectedReview.releaseYear}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* 좋아요 버튼 */}
            <button
              onClick={likeHandler}
              disabled={isLiking}
              className="flex items-center text-red-500 transition hover:scale-105"
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span className="ml-1 text-sm text-black">{likeCount}</span>
            </button>
            {/* 북마크 버튼 */}
            <button
              onClick={bookmarkHandler}
              disabled={isBookmarking}
              className="transition hover:scale-105"
            >
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>
            {/* 기존 삭제 등 버튼 그룹 */}
            <ReviewBtnGroup
              movieId={selectedReview.movieId}
              postId={selectedReview.id}
              authorId={selectedReview.uid}
              onReviewDeleted={onReviewDeleted}
            />
          </div>
        </div>
        <div className="h-64 flex-1 overflow-y-scroll border-y border-black px-4 pb-8 pt-2 lg:h-96">
          <p className="mb-1 text-xs font-bold">리뷰 내용</p>
          <p className="break-keep">{selectedReview.reviewContent}</p>
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-sm">
          <p className="text-xs">{formatDate(selectedReview.createdAt)}</p>
          <div className="flex items-center">
            <span className="mr-1 font-bold">
              {selectedReview.userName ? selectedReview.userName : "Guest"}
            </span>
            님의 리뷰
          </div>
        </div>
        <div className="flex items-center justify-end rounded-b-xl bg-primary-600 p-2">
          <IoCloseOutline
            onClick={closeModalHandler}
            className="cursor-pointer text-white"
            size={26}
          />
        </div>
      </div>
    </div>
  );
}
