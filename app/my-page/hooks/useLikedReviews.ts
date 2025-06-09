"use client";

import { useState, useEffect } from "react";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

interface UseLikedReviewsOptions {
  uid: string;
  search?: string;
  page: number;
  pageSize?: number;
}

interface UseLikedReviewsResult {
  reviews: ReviewDoc[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  removeReview: (reviewId: string) => void;
}

export default function useLikedReviews({
  uid,
  search = "",
  page,
  pageSize = 10,
}: UseLikedReviewsOptions): UseLikedReviewsResult {
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [totalPages, setTotalPages] = useState(0);
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
          uid,
          page: String(page),
          pageSize: String(pageSize),
        });

        if (search) {
          params.set("search", search);
        }

        const res = await fetch(`/api/reviews/liked?${params.toString()}`);

        if (!res.ok) {
          throw new Error("좋아요 리뷰 로딩에 실패했습니다");
        }

        const {
          reviews,
          totalPages,
        }: { reviews: ReviewDoc[]; totalPages: number } = await res.json();

        setReviews(reviews);
        setTotalPages(totalPages);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, search, page, pageSize]);

  const removeReview = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId),
    );
  };

  return { reviews, totalPages, loading, error, removeReview };
}
