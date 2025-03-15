import { useState, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";
import { Review } from "api/reviews/fetchUserReviews";

type SearchField = "review" | "reviewTitle" | "movieTitle";

export default function useReviewSearch(initialReviews: Review[]) {
  const [filteredUserReviews, setFilteredUserReviews] =
    useState<Review[]>(initialReviews);

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
        // 각 리뷰에 대해 검색 필드 중 하나라도 조건에 맞는지 확인
        searchFields.some((field) => {
          // 현재 검색 필드의 값을 가져옴
          const value = review[field as keyof Review];
          // 값이 없는 경우 해당 필드는 검색에서 제외
          if (!value) return false;

          /**
           * 검색어와 검색 대상 값을 정규화하여 일관된 검색이 가능하게 함
           * 1. toString(): 모든 값을 문자열로 변환
           * 2. replace(/\s+/g, ""): 모든 공백 제거
           * 3. toLowerCase(): 대소문자 구분 없이 검색
           */
          const normalizedValue = value
            .toString()
            .replace(/\s+/g, "")
            .toLowerCase();

          // 정규화된 검색어가 정규화된 값에 포함되어 있는지 확인
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
