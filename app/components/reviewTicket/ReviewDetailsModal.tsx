import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import { useAppSelector } from "store/redux-toolkit/hooks";
import Comments from "app/components/reviewTicket/Comment/Comments";
import ModalPortal from "app/components/modal/ModalPortal";
import ReviewBtnGroup from "app/components/reviewTicket/TicketBtnGroup";
import ProfileImage from "app/components/reviewTicket/ProfileImage";
import ActivityBadge from "app/components/ActivityBadge";
import formatDate from "app/utils/formatDate";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken";

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
      try {
        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch(
            `/api/reviews/${selectedReview.id}/like`,
            {
              method: "GET",
              headers: {
                ...authHeaders,
              },
            },
          );

          if (response.ok) {
            const data = await response.json();
            setLiked(data.isLiked);
            return data;
          }

          return null;
        });
      } catch (error) {
        console.error("좋아요 상태 확인 실패:", error);
      }
    };

    if (userState.uid && selectedReview.id) {
      checkStatus();
    }
  }, [userState?.uid, selectedReview.id]);

  const likeHandler = async () => {
    if (!userState?.uid || isLiking) return;
    setIsLiking(true);

    try {
      if (liked) {
        // 좋아요 취소
        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch(
            `/api/reviews/${selectedReview.id}/like`,
            {
              method: "DELETE",
              headers: {
                ...authHeaders,
              },
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "좋아요 취소에 실패했습니다.");
          }

          return response.json();
        });

        setLiked(false);
        setLikeCount((prev) => prev - 1);
        onLikeToggled?.(selectedReview.id, false);
      } else {
        // 좋아요 추가
        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch(
            `/api/reviews/${selectedReview.id}/like`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeaders,
              },
              body: JSON.stringify({
                movieTitle: review.movieTitle,
              }),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "좋아요 추가에 실패했습니다.");
          }

          return response.json();
        });

        setLiked(true);
        setLikeCount((prev) => prev + 1);
        onLikeToggled?.(selectedReview.id, true);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert(
        error instanceof Error ? error.message : "좋아요 처리에 실패했습니다.",
      );
    } finally {
      setIsLiking(false);
    }
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
          {userState?.uid && user.uid && userState.uid === user.uid && (
            <ReviewBtnGroup
              movieId={String(review.movieId)}
              postId={selectedReview.id}
              authorId={userState.uid}
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
      {/* 리뷰 작성자 정보 */}
      <div className="pb-4 text-sm">
        <div className="flex items-center gap-2">
          <ProfileImage
            photoURL={user.photoURL || undefined}
            userDisplayName={user.displayName || "익명"}
          />
          <span className="font-bold">{user.displayName}</span>
          <ActivityBadge
            activityLevel={(user as any).activityLevel}
            size="tiny"
          />
        </div>
      </div>
      <div className="mb-4 max-h-80 overflow-y-auto border-t-4 border-dotted pb-4 pt-4 scrollbar-hide">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-800">
          리뷰 내용
        </h2>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="break-keep text-sm leading-relaxed text-gray-700">
            {review.reviewContent}
          </p>
        </div>
      </div>
      <div className="py-2 text-xs text-gray-600">
        {formatDate(review.createdAt)}
      </div>
      {/* 댓글 영역 - 모달이 열릴 때만 렌더링 */}
      {isModalOpen && user.uid && (
        <Comments id={selectedReview.id} reviewAuthorId={user.uid} />
      )}
    </ModalPortal>
  );
}
