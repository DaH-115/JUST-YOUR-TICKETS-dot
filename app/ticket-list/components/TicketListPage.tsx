"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import type { Review } from "api/reviews/fetchReviews";
import useReviewSearch from "hooks/useReviewSearch";
import ReviewSearchInput from "app/components/reviewTicket/ReviewSearchInput";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import Pagination from "app/components/Pagination";

interface TicketListPageProps {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
}

export default function TicketListPage({
  reviews: initialReviews,
  currentPage,
  totalPages,
}: TicketListPageProps) {
  const searchParams = useSearchParams();

  // 검색 폼 설정: URL의 검색어를 초기값으로
  const { register, watch } = useForm<{ search: string }>({
    defaultValues: { search: searchParams.get("search") || "" },
  });
  const searchTerm = watch("search");
  const { filteredReviews, searchReviewsHandler } =
    useReviewSearch(initialReviews);

  // 검색어가 바뀔 때마다 필터 적용
  useEffect(() => {
    searchReviewsHandler(searchTerm);
  }, [searchTerm, searchReviewsHandler]);

  const displayedReviews = searchTerm ? filteredReviews : initialReviews;

  return (
    <div className="flex flex-col p-8">
      <main className="w-full flex-1">
        {/* 검색 및 헤더 */}
        <section className="flex w-full flex-col items-center pb-8 md:flex-row">
          <div className="mb-4 flex w-full items-center text-white md:mb-0">
            <h1 className="text-2xl font-bold">ALL TICKET LIST</h1>
            <span className="md:px-4">
              <span className="ml-2 font-bold text-accent-300">
                {displayedReviews.length}장
              </span>
            </span>
          </div>
          <ReviewSearchInput
            label="티켓 검색"
            register={register}
            placeholder="티켓 검색"
          />
        </section>

        {/* 리뷰 목록 */}
        {displayedReviews.length > 0 ? (
          <ReviewTicket reviews={displayedReviews} />
        ) : (
          <div className="flex h-96 w-full items-center justify-center text-center text-lg font-bold text-gray-500">
            등록된 리뷰 티켓이 없습니다.
          </div>
        )}
      </main>
      {/* 페이지네이션 */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
