import { useState, useEffect } from "react";
import { Review } from "lib/reviews/fetchReviews";

interface UseUserReviewsOptions {
  /** 유저별 조회: uid 넘김, 전체 조회: uid 생략 */
  uid?: string;
  search: string;
  page: number;
  pageSize?: number;
}

interface UseUserReviewsResult {
  reviews: Review[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export function useUserReviews({
  uid,
  search,
  page,
  pageSize = 10,
}: UseUserReviewsOptions): UseUserReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // uid가 undefined면 전체 리뷰, 있으면 특정 유저 리뷰
    const params = new URLSearchParams();
    if (uid) params.append("uid", uid);
    if (search) params.append("search", search);
    params.append("page", String(page));
    params.append("pageSize", String(pageSize));

    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/reviews?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("데이터 로딩 실패");
        const json: { reviews: Review[]; totalPages: number } =
          await res.json();
        setReviews(json.reviews);
        setTotalPages(json.totalPages);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [uid, search, page, pageSize]);

  return { reviews, totalPages, loading, error };
}
