"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken";
import { ReviewDoc, ReviewWithLike } from "lib/reviews/fetchReviewsPaginated";

// 리뷰 데이터 상태 관리 훅
export function useReviews(initialReviews: ReviewDoc[]) {
  const userState = useAppSelector(selectUser);
  const [reviews, setReviews] = useState<ReviewWithLike[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 리뷰/좋아요 상태 동기화
  useEffect(() => {
    setIsLoading(true);

    if (!userState?.uid) {
      setReviews(
        initialReviews.map((review) => ({ ...review, isLiked: false })),
      );
      setIsLoading(false);
      return;
    }

    const fetchLikeStatuses = async () => {
      if (initialReviews.length === 0) {
        setReviews([]);
        return;
      }

      try {
        const reviewIds = initialReviews.map((review) => review.id);
        const likesResponse = await apiCallWithTokenRefresh(
          async (authHeaders) => {
            const response = await fetch(`/api/reviews/like-statuses`, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...authHeaders },
              body: JSON.stringify({ reviewIds }),
            });
            if (!response.ok) {
              throw new Error("Failed to fetch like statuses");
            }
            return response.json();
          },
        );

        const likesMap = likesResponse.likes;
        const statuses = initialReviews.map((review) => ({
          ...review,
          isLiked: likesMap[review.id] || false,
        }));
        setReviews(statuses);
      } catch (error) {
        console.error("Error fetching like statuses:", error);
        setReviews(
          initialReviews.map((review) => ({ ...review, isLiked: false })),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikeStatuses();
  }, [initialReviews, userState?.uid]);

  return { reviews, isLoading, setReviews };
}
