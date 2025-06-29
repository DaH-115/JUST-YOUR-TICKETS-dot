"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebase-config";
import type { ReviewFormValues } from "app/write-review/[id]/page";
import type { ReviewContainerProps } from "app/write-review/components/ReviewContainer";

type useReviewDataProps = Pick<ReviewContainerProps, "mode" | "reviewId">;

export function useReviewData({ mode, reviewId }: useReviewDataProps) {
  const [initialData, setInitialData] = useState<ReviewFormValues>();
  const [loading, setLoading] = useState(true);

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, reviewId]);

  return { initialData, loading };
}
