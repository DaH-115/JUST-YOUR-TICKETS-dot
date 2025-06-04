"use client";

import { useEffect, useState } from "react";
import {
  fetchReviewsPaginated,
  ReviewDoc,
} from "lib/reviews/fetchReviewsPaginated";

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
        const { reviews, totalPages } = await fetchReviewsPaginated({
          uid,
          page,
          pageSize,
          search,
        });

        setReviews(reviews);
        setTotalPages(totalPages);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, page, pageSize, search]);

  return { reviews, totalPages, loading, error };
}
