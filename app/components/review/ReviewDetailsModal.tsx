import { useState, useCallback } from "react";
import { FaHeart, FaRegHeart, FaTimes, FaStar } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import ActivityBadge from "app/components/ui/feedback/ActivityBadge";
import ModalPortal from "app/components/ui/modal/ModalPortal";
import ProfileAvatar from "app/components/user/ProfileAvatar";
import ReviewBtnGroup from "app/components/review/TicketBtnGroup";
import formatDate from "app/utils/formatDate";
import { ReviewWithLike } from "lib/reviews/fetchReviewsPaginated";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import CommentList from "app/components/review/comment/CommentList";

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
  const [isLiking, setIsLiking] = useState(false);
  const userState = useAppSelector(selectUser);

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
          <FaStar className="mr-1 text-accent-300" size={18} />
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
          <ProfileAvatar
            s3photoKey={user.photoKey || undefined}
            userDisplayName={user.displayName || "익명"}
            size={32}
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
      {isModalOpen && user.uid && (
        <CommentList id={selectedReview.id} reviewAuthorId={user.uid} />
      )}
    </ModalPortal>
  );
}
