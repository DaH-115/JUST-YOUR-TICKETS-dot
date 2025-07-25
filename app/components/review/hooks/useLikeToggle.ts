"use client";

import { useCallback, useState } from "react";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { useAlert } from "store/context/alertContext";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken/apiCallWithTokenRefresh";
import { ReviewWithLike } from "lib/reviews/fetchReviewsPaginated";

// 좋아요 토글 기능 훅
export function useLikeToggle(
  reviews: ReviewWithLike[],
  setReviews: (reviews: ReviewWithLike[]) => void,
  selectedReview?: ReviewWithLike,
  setSelectedReview?: (review: ReviewWithLike | undefined) => void,
  onLikeToggled?: (
    reviewId: string,
    newLikeCount: number,
    isLiked: boolean,
  ) => void,
) {
  const userState = useAppSelector(selectUser);
  const { showErrorHandler } = useAlert();
  const [likingReviewId, setLikingReviewId] = useState<string | null>(null);

  // 좋아요 상태 및 개수 업데이트 (리스트/모달 동기화)
  const updateReviewLikeState = useCallback(
    (reviewId: string, isLiked: boolean, likeCount: number) => {
      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? { ...review, isLiked, review: { ...review.review, likeCount } }
            : review,
        ),
      );
      if (selectedReview?.id === reviewId && setSelectedReview) {
        setSelectedReview(
          selectedReview
            ? {
                ...selectedReview,
                isLiked,
                review: { ...selectedReview.review, likeCount },
              }
            : undefined,
        );
      }
    },
    [reviews, selectedReview, setReviews, setSelectedReview],
  );

  // 좋아요 토글 핸들러 (Optimistic UI)
  const likeToggleHandler = useCallback(
    async (reviewId: string) => {
      if (!userState?.uid) {
        showErrorHandler("오류", "로그인이 필요합니다.");
        return;
      }

      const reviewToUpdate = reviews.find((review) => review.id === reviewId);
      if (!reviewToUpdate) return;

      setLikingReviewId(reviewId);
      const currentLikedStatus = reviewToUpdate.isLiked;
      const newLikedStatus = !currentLikedStatus;
      const originalLikeCount = reviewToUpdate.review.likeCount;
      const newLikeCount = newLikedStatus
        ? originalLikeCount + 1
        : originalLikeCount - 1;

      // Optimistic UI: UI를 먼저 업데이트
      updateReviewLikeState(reviewId, newLikedStatus, newLikeCount);

      try {
        // 서버에 좋아요/취소 요청
        const { likeCount: updatedLikeCount } = await apiCallWithTokenRefresh(
          async (authHeaders) => {
            const response = await fetch(`/api/reviews/${reviewId}/like`, {
              method: newLikedStatus ? "POST" : "DELETE",
              headers: { "Content-Type": "application/json", ...authHeaders },
              body: newLikedStatus
                ? JSON.stringify({
                    movieTitle: reviewToUpdate.review.movieTitle,
                  })
                : undefined,
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error);
            }
            return response.json();
          },
        );

        // 서버에서 받은 최종 likeCount로 상태 반영
        updateReviewLikeState(reviewId, newLikedStatus, updatedLikeCount);

        // 콜백 호출
        onLikeToggled?.(reviewId, updatedLikeCount, newLikedStatus);
      } catch (error: unknown) {
        // 에러 발생 시 optimistic UI 롤백
        updateReviewLikeState(reviewId, currentLikedStatus, originalLikeCount);

        if (error instanceof Error) {
          showErrorHandler("오류", error.message);
        }
      } finally {
        setLikingReviewId(null);
      }
    },
    [
      showErrorHandler,
      userState?.uid,
      reviews,
      onLikeToggled,
      updateReviewLikeState,
    ],
  );

  return { likingReviewId, likeToggleHandler };
}
