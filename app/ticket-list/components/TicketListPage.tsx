"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Pagination from "app/components/Pagination";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import SearchForm from "app/components/SearchForm";
import EmptyState from "app/my-page/components/EmptyState";
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
    <div className="flex flex-col p-6">
      {/* 헤더 */}
      <section className="mb-4">
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
      </section>

      {/* 검색 폼 & 결과 정보 */}
      <div className="my-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          {searchTerm && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">"{searchTerm}"</span> 검색 결과:
              {initialReviews.length}개
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <SearchForm onSearch={searchHandler} placeholder="티켓 검색" />
        </div>
      </div>

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
