"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchForm from "app/components/SearchForm";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import Pagination from "app/components/Pagination";
import EmptyState from "app/my-page/components/EmptyState";
import { useCallback } from "react";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

interface TicketListPageProps {
  initialReviews: ReviewDoc[];
  totalPages: number;
}

export default function TicketListPage({
  initialReviews,
  totalPages,
}: TicketListPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const currentPage = parseInt(params.get("page") || "1", 10);
  const searchTerm = params.get("search") || "";

  const searchHandler = useCallback(
    (searchTerm: string) => {
      router.replace(
        `${pathname}?&search=${encodeURIComponent(searchTerm)}&page=1`,
      );
    },
    [router, pathname],
  );

  const pageChangeHandler = useCallback(
    (page: number) => {
      router.push(
        `${pathname}?&search=${encodeURIComponent(searchTerm)}&page=${page}`,
      );
    },
    [router, pathname, searchTerm],
  );

  return (
    <div className="flex flex-col p-8">
      <section className="flex w-full flex-col items-center pb-8 md:flex-row">
        <div className="mb-4 flex w-full flex-col md:mb-0">
          <div className="mb-2 flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              All Ticket List
            </h1>
            <span className="ml-2 font-bold text-accent-300">
              {initialReviews.length}장
            </span>
          </div>
          <p className="text-sm text-gray-300">
            모든 사용자들의 리뷰 티켓을 확인해보세요
          </p>
        </div>
        {/* 유효성 검증 */}
        <div className="mt-4 md:mt-0">
          <SearchForm onSearch={searchHandler} placeholder="티켓 검색" />
        </div>
      </section>
      {/* 리뷰 리스트 */}
      {initialReviews.length > 0 ? (
        <ReviewTicket reviews={initialReviews} />
      ) : (
        <EmptyState message="등록된 리뷰 티켓이 없습니다" />
      )}
      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={pageChangeHandler}
      />
    </div>
  );
}
