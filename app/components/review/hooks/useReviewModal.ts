"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { useAlert } from "store/context/alertContext";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken/apiCallWithTokenRefresh";
import { ReviewWithLike } from "lib/reviews/fetchReviewsPaginated";

// 리뷰 모달 상태 관리 훅
export function useReviewModal(
  reviews: ReviewWithLike[],
  reviewId?: string | null,
  isLoading?: boolean,
) {
  const userState = useAppSelector(selectUser);
  const { showErrorHandler } = useAlert();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewWithLike>();

  // 상세 모달 오픈
  const openModalHandler = useCallback((selectedReview: ReviewWithLike) => {
    setSelectedReview(selectedReview);
    setIsModalOpen(true);
  }, []);

  // 상세 모달 닫기
  const closeModalHandler = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // 상세 모달을 특정 리뷰 ID로 오픈 (리뷰가 없으면 서버에서 fetch)
  useEffect(() => {
    const openModalForReview = async (id: string) => {
      let reviewToOpen = reviews.find((review) => review.id === id);

      if (!reviewToOpen) {
        try {
          const fetchedReview = await apiCallWithTokenRefresh(
            async (authHeaders) => {
              const res = await fetch(`/api/reviews/${id}`, {
                headers: authHeaders,
              });
              if (!res.ok) throw new Error("리뷰를 가져오지 못했습니다.");
              return res.json();
            },
          );

          if (userState?.uid) {
            const likesResponse = await apiCallWithTokenRefresh(
              async (authHeaders) => {
                const response = await fetch(
                  `/api/reviews/${fetchedReview.id}/like`,
                  {
                    method: "GET",
                    headers: authHeaders,
                  },
                );
                if (!response.ok) {
                  throw new Error("Failed to fetch like status");
                }
                return response.json();
              },
            );
            const isLiked = likesResponse.isLiked || false;
            reviewToOpen = { ...fetchedReview, isLiked };
          } else {
            reviewToOpen = { ...fetchedReview, isLiked: false };
          }
        } catch (error: unknown) {
          console.error("특정 리뷰를 가져오는 데 실패했습니다.", error);
          showErrorHandler("오류", "리뷰를 불러오는 데 실패했습니다.");
          return;
        }
      }

      if (reviewToOpen) {
        openModalHandler(reviewToOpen);
      }
    };

    if (reviewId && !isLoading) {
      openModalForReview(reviewId);
    }
  }, [
    reviewId,
    openModalHandler,
    reviews,
    showErrorHandler,
    userState?.uid,
    isLoading,
  ]);

  return {
    isModalOpen,
    selectedReview,
    setSelectedReview,
    openModalHandler,
    closeModalHandler,
  };
}
