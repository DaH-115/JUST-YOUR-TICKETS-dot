import { useState, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";
import { Review } from "lib/reviews/fetchReviews";

type SearchField = "reviewContent" | "reviewTitle" | "movieTitle";

export default function useReviewSearch(initialReviews: Review[]) {
  const [filteredReviews, setFilteredReviews] =
    useState<Review[]>(initialReviews);

  // initialReviews 변경 시 원본으로 리셋
  useEffect(() => {
    setFilteredReviews(initialReviews);
  }, [initialReviews]);

  // 검색 로직만 분리한 함수
  const doSearch = (term: string) => {
    if (!term.trim()) {
      setFilteredReviews(initialReviews);
      return;
    }

    const normalizedTerm = term.replace(/\s+/g, "").toLowerCase();
    const fields: SearchField[] = [
      "reviewContent",
      "reviewTitle",
      "movieTitle",
    ];

    const results = initialReviews.filter((r) =>
      fields.some((f) => {
        const v = r[f];
        if (!v) return false;
        return v
          .toString()
          .replace(/\s+/g, "")
          .toLowerCase()
          .includes(normalizedTerm);
      }),
    );

    setFilteredReviews(results);
  };

  // debounce는 한 번만 생성
  const searchReviewsHandler = useMemo(
    () => debounce(doSearch, 300),
    [initialReviews],
  );

  // 언마운트 시 타이머 정리
  useEffect(() => () => searchReviewsHandler.cancel(), [searchReviewsHandler]);

  return { filteredReviews, searchReviewsHandler };
}
