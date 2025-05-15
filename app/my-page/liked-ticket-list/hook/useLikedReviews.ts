import { useState, useEffect } from "react";
import { Review } from "lib/reviews/fetchReviews";

interface UseLikedReviewsOptions {
  uid: string;
  search?: string;
  page: number;
  pageSize?: number;
}

interface UseLikedReviewsResult {
  reviews: Review[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export function useLikedReviews({
  uid,
  search = "",
  page,
  pageSize = 10,
}: UseLikedReviewsOptions): UseLikedReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // uid 없으면 초기화
    if (!uid) {
      setReviews([]);
      setTotalPages(0);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 쿼리파라미터 조립
        const params = new URLSearchParams({
          uid,
          page: String(page),
          pageSize: String(pageSize),
        });

        if (search) {
          params.set("search", search);
        }

        // API 호출
        const res = await fetch(`/api/reviews/liked?${params.toString()}`);

        if (!res.ok) {
          throw new Error("좋아요 리뷰 로딩에 실패했습니다");
        }

        // 응답 데이터 파싱
        const {
          reviews,
          totalPages,
        }: { reviews: Review[]; totalPages: number } = await res.json();

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

  return { reviews, totalPages, loading, error };
}
