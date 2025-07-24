"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Pagination from "app/components/ui/layout/Pagination";
import SearchSection from "app/components/search/SearchSection";
import ReviewTicket from "app/components/review/ReviewTicket";
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
  const reviewId = params.get("reviewId");

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
    <main className="flex flex-col p-6">
      {/* 헤더 */}
      <header className="mb-8">
        <div className="mb-2 flex items-center space-x-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            All Ticket List
          </h1>
          <span className="ml-2 font-bold text-accent-300">
            {initialReviews.length}
          </span>
        </div>
        <p className="text-sm text-gray-300">
          모든 사용자들의 리뷰 티켓을 확인해보세요
        </p>
      </header>

      {/* 리뷰 리스트 */}
      {initialReviews.length > 0 ? (
        <ReviewTicket reviews={initialReviews} reviewId={reviewId} />
      ) : (
        <EmptyState message="등록된 리뷰 티켓이 없습니다" />
      )}

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={pageChangeHandler}
      />

      {/* 검색 폼 & 결과 정보 */}
      <SearchSection
        searchTerm={searchTerm}
        resultCount={initialReviews.length}
        onSearch={searchHandler}
      />
    </main>
  );
}
