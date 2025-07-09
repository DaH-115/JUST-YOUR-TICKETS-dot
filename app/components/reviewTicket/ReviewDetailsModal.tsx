import { useEffect, useState, Suspense, lazy, useCallback } from "react";
import { FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import ActivityBadge from "app/components/ActivityBadge";
import ModalPortal from "app/components/modal/ModalPortal";
import ProfileImage from "app/components/reviewTicket/ProfileImage";
import ReviewBtnGroup from "app/components/reviewTicket/TicketBtnGroup";
import formatDate from "app/utils/formatDate";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";

// 댓글 컴포넌트 지연 로딩
const CommentList = lazy(
  () => import("app/components/reviewTicket/Comment/CommentList"),
);

interface ReviewDetailsModalProps {
  isModalOpen: boolean;
  closeModalHandler: () => void;
  selectedReview: ReviewDoc;
  onReviewDeleted: (id: string) => void;
  onLikeToggled?: (reviewId: string, isLiked: boolean) => void;
}

// 좋아요 기능을 위한 커스텀 훅
function useLikeStatus(
  reviewId: string,
  initialLikeCount: number,
  isModalOpen: boolean,
) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiking, setIsLiking] = useState(false);
  const [isLikeStatusLoaded, setIsLikeStatusLoaded] = useState(false);

  const userState = useAppSelector(selectUser);

  // 리뷰 ID가 변경될 때 상태 초기화
  useEffect(() => {
    setLiked(false);
    setLikeCount(initialLikeCount);
    setIsLikeStatusLoaded(false);
  }, [reviewId, initialLikeCount]);

  // 모달이 열린 후 좋아요 상태 확인 (지연 로딩)
  useEffect(() => {
    if (!isModalOpen || !userState?.uid || isLikeStatusLoaded) {
      return;
    }

    const checkLikeStatus = async () => {
      try {
        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch(`/api/reviews/${reviewId}/like`, {
            method: "GET",
            headers: { ...authHeaders },
          });

          if (response.ok) {
            const data = await response.json();
            setLiked(data.isLiked);
            setIsLikeStatusLoaded(true);
            return data;
          }
          return null;
        });
      } catch (error) {
        console.error("좋아요 상태 확인 실패:", error);
        setIsLikeStatusLoaded(true);
      }
    };

    // 모달이 열린 후 지연 로딩
    const timer = setTimeout(checkLikeStatus, 100);
    return () => clearTimeout(timer);
  }, [isModalOpen, userState?.uid, reviewId, isLikeStatusLoaded]);

  const toggleLike = useCallback(
    async (
      movieTitle: string,
      onLikeToggled?: (reviewId: string, isLiked: boolean) => void,
    ) => {
      if (!userState?.uid || isLiking) return;
      setIsLiking(true);

      try {
        if (liked) {
          await apiCallWithTokenRefresh(async (authHeaders) => {
            const response = await fetch(`/api/reviews/${reviewId}/like`, {
              method: "DELETE",
              headers: { ...authHeaders },
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "좋아요 취소에 실패했습니다.");
            }
            return response.json();
          });

          setLiked(false);
          setLikeCount((prev) => prev - 1);
          onLikeToggled?.(reviewId, false);
        } else {
          await apiCallWithTokenRefresh(async (authHeaders) => {
            const response = await fetch(`/api/reviews/${reviewId}/like`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeaders,
              },
              body: JSON.stringify({ movieTitle }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "좋아요 추가에 실패했습니다.");
            }
            return response.json();
          });

          setLiked(true);
          setLikeCount((prev) => prev + 1);
          onLikeToggled?.(reviewId, true);
        }
      } catch (error) {
        console.error("좋아요 처리 실패:", error);
        alert(
          error instanceof Error
            ? error.message
            : "좋아요 처리에 실패했습니다.",
        );
      } finally {
        setIsLiking(false);
      }
    },
    [liked, isLiking, userState?.uid, reviewId],
  );

  return { liked, likeCount, isLiking, toggleLike };
}

export default function ReviewDetailsModal({
  isModalOpen,
  closeModalHandler,
  selectedReview,
  onReviewDeleted,
  onLikeToggled,
}: ReviewDetailsModalProps) {
  const { review, user } = selectedReview;
  const [showComments, setShowComments] = useState(false);

  const userState = useAppSelector(selectUser);
  const { liked, likeCount, isLiking, toggleLike } = useLikeStatus(
    selectedReview.id,
    review.likeCount || 0,
    isModalOpen,
  );

  // 모달이 열린 후 댓글 컴포넌트 지연 렌더링
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

  const handleLikeClick = useCallback(() => {
    toggleLike(review.movieTitle, onLikeToggled);
  }, [toggleLike, review.movieTitle, onLikeToggled]);

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
            onClick={handleLikeClick}
            disabled={!userState?.uid || isLiking}
            className="flex items-center text-red-500 transition hover:scale-105"
            data-testid="like-button"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span className="ml-1 text-sm text-black">{likeCount}</span>
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
        {/* 모달 닫기 버튼 */}
        <button
          onClick={closeModalHandler}
          className="ml-4 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="모달 닫기"
          data-testid="close-button"
        >
          <FaTimes size={16} />
        </button>
      </div>
      {/* 리뷰 작성자 정보 */}
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
      {/* 댓글 영역 - 지연 로딩 */}
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
