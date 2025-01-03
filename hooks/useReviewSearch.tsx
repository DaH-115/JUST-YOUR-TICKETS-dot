import { useState, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";
import { MovieReview } from "api/movie-reviews/fetchMovieReviews";

type SearchField = "review" | "reviewTitle" | "movieTitle";

export default function useReviewSearch(initialReviews: MovieReview[]) {
  const [filteredUserReviews, setFilteredUserReviews] =
    useState<MovieReview[]>(initialReviews);

  const searchReviewsHandler = useCallback(
    debounce((term: string) => {
      // 검색어가 비어있으면 모든 리뷰를 보여줍니다
      if (!term.trim()) {
        setFilteredUserReviews(initialReviews);
        return;
      }

      const normalizedTerm = term.replace(/\s+/g, "").toLowerCase();
      const searchFields: SearchField[] = [
        "review",
        "reviewTitle",
        "movieTitle",
      ];

      const results = initialReviews.filter((review) =>
        searchFields.some((field) => {
          const value = review[field];
          if (!value) return false;

          const normalizedValue = value.replace(/\s+/g, "").toLowerCase();
          return normalizedValue.includes(normalizedTerm);
        }),
      );

      setFilteredUserReviews(results);
    }, 300),
    [initialReviews],
  );

  // debounce 타이머를 정리
  useEffect(() => {
    return () => {
      searchReviewsHandler.cancel();
    };
  }, [searchReviewsHandler]);

  return {
    filteredUserReviews,
    searchReviewsHandler,
  };
}
