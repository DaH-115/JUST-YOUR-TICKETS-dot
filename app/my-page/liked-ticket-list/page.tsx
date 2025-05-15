"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import SearchForm from "app/components/SearchForm";
import { useLikedReviews } from "app/my-page/liked-ticket-list/hook/useLikedReviews";
import MyTicketHeader from "app/my-page/components/MyTicketPageHeader";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import Pagination from "app/components/Pagination";
import EmptyState from "app/my-page/components/EmptyState";
import Loading from "app/loading";
import { useCallback } from "react";

const PAGE_SIZE = 10;

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const uid = params.get("uid") || "";
  const currentPage = parseInt(params.get("page") || "1", 10);
  const searchTerm = params.get("search") || "";

  // 좋아요 리뷰 가져오는 훅
  const { reviews, totalPages, loading, error } = useLikedReviews({
    uid,
    search: searchTerm,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const searchHandler = useCallback(
    (searchTerm: string) => {
      router.replace(
        `${pathname}?uid=${uid}&search=${encodeURIComponent(searchTerm)}&page=1`,
      );
    },
    [router, pathname, uid],
  );

  const pageChangeHandler = useCallback(
    (page: number) => {
      router.push(
        `${pathname}?uid=${uid}&search=${encodeURIComponent(
          searchTerm,
        )}&page=${page}`,
      );
    },
    [router, pathname, uid, searchTerm],
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="w-full flex-1 flex-col lg:flex-row">
        {/* 헤더 */}
        <MyTicketHeader
          title="Liked Ticket List"
          content="좋아요한 티켓 목록입니다"
          userReviews={reviews}
        />
        {/* 검색 폼 */}
        <div className="mb-4 flex justify-end">
          <SearchForm onSearch={searchHandler} placeholder="좋아요 티켓 검색" />
        </div>
        {/* 리뷰 리스트 */}
        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-red-500">오류: {error}</p>
        ) : reviews.length > 0 ? (
          <ReviewTicket reviews={reviews} />
        ) : (
          <EmptyState message="좋아요한 티켓이 없습니다" />
        )}
      </main>
      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={pageChangeHandler}
      />
    </div>
  );
}
