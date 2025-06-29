"use client";

import { useEffect, useState } from "react";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

interface UseMyReviewsOptions {
  uid: string;
  search?: string;
  page: number;
  pageSize?: number;
}

interface UseMyReviewsResult {
  reviews: ReviewDoc[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export default function useMyReviews({
  uid,
  search = "",
  page,
  pageSize = 10,
}: UseMyReviewsOptions): UseMyReviewsResult {
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setReviews([]);
      setTotalPages(0);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          uid,
          ...(search && { search }),
        });

        const response = await fetch(`/api/reviews?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();

        setReviews(data.reviews);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        setError(error.message || "리뷰 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, page, pageSize, search]);

  return { reviews, totalPages, loading, error };
}
