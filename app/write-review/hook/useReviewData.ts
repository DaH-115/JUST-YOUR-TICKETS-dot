"use client";

import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "firebase-config";
import type { ReviewContainerProps } from "app/write-review/components/ReviewContainer";
import type { ReviewFormValues } from "app/write-review/types";

type useReviewDataProps = Pick<ReviewContainerProps, "mode" | "reviewId">;

/**
 * 리뷰 데이터(초기값) 비동기 로딩 커스텀 훅
 * - 리뷰 수정 시 Firestore에서 기존 리뷰 데이터를 불러와 폼에 초기값으로 제공
 * @param mode - "edit"(수정) | "new"(작성)
 * @param reviewId - 리뷰 ID (수정 시)
 * @returns initialData, loading
 */
export function useReviewData({ mode, reviewId }: useReviewDataProps) {
  // 폼 초기값 상태
  const [initialData, setInitialData] = useState<ReviewFormValues>();
  // 로딩 상태
  const [loading, setLoading] = useState(true);

  /**
   * mode/reviewId 변경 시 Firestore에서 리뷰 데이터 비동기 로딩
   * - Firestore 문서 구조에서 review 객체 안의 데이터 추출
   */
  useEffect(() => {
    (async () => {
      try {
        if (mode === "edit" && reviewId) {
          const snap = await getDoc(doc(db, "movie-reviews", reviewId));
          if (snap.exists()) {
            const data = snap.data();
            // Firestore 문서 구조에서 review 객체 안의 데이터 추출
            setInitialData({
              reviewTitle: data.review?.reviewTitle || "",
              reviewContent: data.review?.reviewContent || "",
              rating: data.review?.rating || 5,
            });
          }
        }
      } catch (error) {
        console.error("리뷰 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, reviewId]);

  // UI에서 사용할 상태 반환
  return { initialData, loading };
}
