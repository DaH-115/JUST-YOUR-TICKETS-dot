"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken/apiCallWithTokenRefresh";
import { ReviewWithLike } from "lib/reviews/fetchReviewsPaginated";

// 리뷰 데이터 상태 관리 훅
export function useReviews(initialReviews: ReviewWithLike[]) {
  const userState = useAppSelector(selectUser);
  const [reviews, setReviews] = useState<ReviewWithLike[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // 테스트 환경에서는 isLiked 필드를 그대로 사용
    if (process.env.NODE_ENV === "test") {
      setReviews(initialReviews);
      setIsLoading(false);
      return;
    }

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
