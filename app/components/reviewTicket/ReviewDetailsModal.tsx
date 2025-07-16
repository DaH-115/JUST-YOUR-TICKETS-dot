import { useEffect, useState, Suspense, lazy, useCallback } from "react";
import { FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { IoStar } from "react-icons/io5";
import ActivityBadge from "app/components/ActivityBadge";
import ModalPortal from "app/components/modal/ModalPortal";
import ProfileImage from "app/components/ProfileImage";
import ReviewBtnGroup from "app/components/reviewTicket/TicketBtnGroup";
import formatDate from "app/utils/formatDate";
import { ReviewWithLike } from "lib/reviews/fetchReviewsPaginated";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";

const CommentList = lazy(
  () => import("app/components/reviewTicket/comment/CommentList"),
);

interface ReviewDetailsModalProps {
  isModalOpen: boolean;
  closeModalHandler: () => void;
  selectedReview: ReviewWithLike;
  onReviewDeleted: (id: string) => void;
  onLikeToggle: (reviewId: string) => Promise<void>;
}

export default function ReviewDetailsModal({
  isModalOpen,
  closeModalHandler,
  selectedReview,
  onReviewDeleted,
  onLikeToggle,
}: ReviewDetailsModalProps) {
  const { review, user, isLiked } = selectedReview;
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const userState = useAppSelector(selectUser);

  useEffect(() => {
    if (!isModalOpen) {
      setShowComments(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowComments(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [isModalOpen]);

  const handleLikeClick = useCallback(async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLikeToggle(selectedReview.id);
    } finally {
      setIsLiking(false);
    }
  }, [isLiking, onLikeToggle, selectedReview.id]);

  return (
    <ModalPortal isOpen={isModalOpen} onClose={closeModalHandler}>
      <div className="flex w-full items-center justify-between pb-4">
        <div className="mr-4 flex h-full items-center justify-center">
          <IoStar className="mr-1 text-accent-300" size={18} />
          <p className="text-2xl font-bold md:text-3xl">{review.rating}</p>
        </div>
        <div className="w-full">
          <h1 className="font-bold">{review?.reviewTitle}</h1>
          <div className="flex text-xs text-gray-600">
            {review.movieTitle} - {review.releaseYear}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* 좋아요 버튼 */}
          <button
            onClick={handleLikeClick}
            disabled={!userState?.uid || isLiking}
            className="group flex items-center justify-center text-red-500"
            data-testid="like-button"
          >
            <div className="transition-transform duration-200 group-hover:scale-110">
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </div>
            <div className="ml-1.5 flex min-w-[1.5rem] items-center justify-center">
              {isLiking ? (
                <ImSpinner2 className="animate-spin" />
              ) : (
                <span className="text-sm text-black">{review.likeCount}</span>
              )}
            </div>
          </button>
          {/* 리뷰 작성자와 로그인한 유저가 같을 때만 수정/삭제 버튼 노출 */}
          {userState?.uid &&
            selectedReview.user?.uid &&
            userState.uid === selectedReview.user.uid && (
              <ReviewBtnGroup
                movieId={String(review.movieId)}
                postId={selectedReview.id}
                authorId={selectedReview.user.uid}
                onReviewDeleted={onReviewDeleted}
              />
            )}
        </div>
        <button
          onClick={closeModalHandler}
          className="ml-4 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="모달 닫기"
          data-testid="close-button"
        >
          <FaTimes size={16} />
        </button>
      </div>
      <div className="pb-4 text-sm">
        <div className="flex items-center gap-2">
          <ProfileImage
            photoKey={user.photoKey || undefined}
            userDisplayName={user.displayName || "익명"}
          />
          <span className="font-bold">{user.displayName}</span>
          <ActivityBadge activityLevel={user.activityLevel} size="tiny" />
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto border-t-4 border-dotted pb-4 pt-4 scrollbar-hide">
        <h2 className="sr-only">리뷰 내용</h2>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="break-keep text-sm leading-relaxed text-gray-700">
            {review.reviewContent}
          </p>
        </div>
      </div>
      <div className="py-2 text-right text-xs text-gray-600">
        {formatDate(review.createdAt)}
      </div>
      {showComments && user.uid && (
        <Suspense
          fallback={
            <div className="py-4 text-center" data-testid="comments-loading">
              <div className="text-sm text-gray-500">댓글을 불러오는 중...</div>
            </div>
          }
        >
          <CommentList id={selectedReview.id} reviewAuthorId={user.uid} />
        </Suspense>
      )}
    </ModalPortal>
  );
}
