import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
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
import Comments from "app/components/reviewTicket/Comment/Comments";
import ModalPortal from "app/components/modal/ModalPortal";
import ReviewBtnGroup from "app/components/reviewTicket/TicketBtnGroup";
import ProfileImage from "app/components/reviewTicket/ProfileImage";
import ActivityBadge from "app/components/ActivityBadge";
import formatDate from "app/utils/formatDate";

interface ReviewDetailsModalProps {
  isModalOpen: boolean;
  closeModalHandler: () => void;
  selectedReview: ReviewDoc;
  onReviewDeleted: (id: string) => void;
  onLikeToggled?: (reviewId: string, isLiked: boolean) => void;
}

export default function ReviewDetailsModal({
  isModalOpen,
  closeModalHandler,
  selectedReview,
  onReviewDeleted,
  onLikeToggled,
}: ReviewDetailsModalProps) {
  const { review, user } = selectedReview;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const userState = useAppSelector((state) => state.userData.auth);

  useEffect(() => {
    setLiked(false);
    setLikeCount(review.likeCount || 0);
  }, [review.likeCount]);

  useEffect(() => {
    if (!userState?.uid) {
      return;
    }

    const checkStatus = async () => {
      const likeRef = doc(
        db,
        "users",
        userState.uid,
        "liked-reviews",
        selectedReview.id,
      );

      const likeSnap = await getDoc(likeRef);

      setLiked(likeSnap.exists());
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
      await updateDoc(reviewRef, { "review.likeCount": increment(-1) });
      setLiked(false);
      setLikeCount((prev) => prev - 1);
      // 좋아요 취소 콜백 호출
      onLikeToggled?.(selectedReview.id, false);
    } else {
      // 좋아요한 기록이 없다면 추가
      await setDoc(likeRef, {
        likedAt: serverTimestamp(),
        movieTitle: review.movieTitle,
      });
      await updateDoc(reviewRef, { "review.likeCount": increment(1) });
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      // 좋아요 추가 콜백 호출
      onLikeToggled?.(selectedReview.id, true);
    }

    setIsLiking(false);
  };

  return (
    <ModalPortal isOpen={isModalOpen} onClose={closeModalHandler}>
      <div className="flex w-full items-center justify-between pb-4">
        {/* 왼쪽: 별점 영역 */}
        <div className="mr-4 flex h-full items-center justify-center">
          <IoStar className="mr-1 text-accent-300" size={18} />
          <p className="text-2xl font-bold md:text-3xl">{review.rating}</p>
        </div>
        {/* 오른쪽: 타이틀 및 버튼 */}
        <div className="w-full">
          <h1 className="font-bold">{review?.reviewTitle}</h1>
          <div className="flex text-xs text-gray-600">
            {review.movieTitle} - {review.releaseYear}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* 좋아요 버튼 */}
          <button
            onClick={likeHandler}
            disabled={!userState?.uid || isLiking}
            className="flex items-center text-red-500 transition hover:scale-105"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span className="ml-1 text-sm text-black">{likeCount}</span>
          </button>
          {/* 리뷰 작성자와 로그인한 유저가 같을 때만 수정/삭제 버튼 노출 */}
          {userState?.uid && (
            <ReviewBtnGroup
              movieId={String(review.movieId)}
              postId={selectedReview.id}
              authorId={user.uid}
              onReviewDeleted={onReviewDeleted}
            />
          )}
        </div>
        {/* 모달 닫기 버튼 */}
        <button
          onClick={closeModalHandler}
          className="text-gray-400 transition-colors hover:text-gray-600"
          aria-label="모달 닫기"
        >
          <FaTimes size={16} />
        </button>
      </div>
      <div className="flex items-center justify-between pb-4 text-sm">
        <span className="text-xs text-gray-600">
          {formatDate(review.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          <ProfileImage
            photoURL={user.photoURL || undefined}
            userDisplayName={user.displayName || "익명"}
          />
          <span className="font-bold">{user.displayName}</span>
          <ActivityBadge uid={user.uid} size="tiny" />
        </div>
      </div>
      <div className="mb-4 max-h-64 overflow-y-auto border-t-4 border-dotted pb-4 pt-4 scrollbar-hide">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-800">
          리뷰 내용
        </h2>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="break-keep text-sm leading-relaxed text-gray-700">
            {review.reviewContent}
          </p>
        </div>
      </div>
      {/* 댓글 영역 - 모달이 열릴 때만 렌더링 */}
      {isModalOpen && (
        <Comments id={selectedReview.id} reviewAuthorId={user.uid} />
      )}
    </ModalPortal>
  );
}
