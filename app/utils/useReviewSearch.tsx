import { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { MovieReview } from "api/movie-reviews/fetchMovieReviews";

type SearchField = "review" | "reviewTitle" | "movieTitle";

export default function useReviewSearch(initialReviews: MovieReview[]) {
  const [filteredUserReviews, setFilteredUserReviews] =
    useState<MovieReview[]>(initialReviews);

  const searchReviewsHandler = useCallback(
    debounce((term: string) => {
      // 검색어에서 공백 제거
      const normalizedTerm = term.replace(/\s+/g, "").toLowerCase();

      const results = initialReviews.filter((review) =>
        ["review", "reviewTitle", "movieTitle"].some((field) => {
          const value = review[field as SearchField];
          if (!value) return false;

          // 검색 대상 문자열에서도 공백 제거
          const normalizedValue = value.replace(/\s+/g, "").toLowerCase();

          return normalizedValue.includes(normalizedTerm);
        }),
      );

      setFilteredUserReviews(results);
    }, 300),
    [initialReviews],
  );

  return {
    filteredUserReviews,
    searchReviewsHandler,
  };
}
