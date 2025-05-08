"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Review } from "lib/reviews/fetchReviews";
import MyTicketHeader from "app/my-page/my-ticket-list/components/MyTicketPageHeader";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import EmptyState from "app/my-page/components/EmptyState";
import Pagination from "app/components/Pagination";
import useReviewSearch from "hooks/useReviewSearch";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";

const PAGE_SIZE = 10;

interface PaginatedResult {
  reviews: Review[];
  totalPages: number;
}

export default function MyTicketListPage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") || "";

  const [page, setPage] = useState<number>(1);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // 검색(필터) 훅
  const { filteredReviews } = useReviewSearch(userReviews);
  const displayReviews =
    filteredReviews.length > 0 ? filteredReviews : userReviews;

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    (async () => {
      const { reviews, totalPages } = (await fetchReviewsPaginated({
        uid,
        page,
        pageSize: PAGE_SIZE,
      })) as PaginatedResult;
      setUserReviews(reviews);
      setTotalPages(totalPages);
      setLoading(false);
    })();
  }, [uid, page]);

  if (!uid) return <div>로그인이 필요합니다</div>;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="w-full flex-1 flex-col lg:flex-row">
        <MyTicketHeader userReviews={userReviews} />
        <p className="mb-6 text-white">전체 {userReviews.length}장</p>

        {loading ? (
          <p className="text-white">로딩 중…</p>
        ) : displayReviews.length > 0 ? (
          <ReviewTicket reviews={displayReviews} />
        ) : (
          <EmptyState message="작성한 리뷰가 없습니다" />
        )}
      </main>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
