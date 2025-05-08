"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchLikedReviewsPaginated } from "lib/reviews/fetchLikedReviews";
import fetchReviewById from "lib/reviews/fetchReviewById";
import { Review } from "lib/reviews/fetchReviews";
import Pagination from "app/components/Pagination";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import EmptyState from "app/my-page/components/EmptyState";

const PAGE_SIZE = 10;

export default function Page() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const [page, setPage] = useState<number>(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    (async () => {
      const { reviews: liked, totalPages } = await fetchLikedReviewsPaginated(
        uid,
        page,
        PAGE_SIZE,
      );
      const detailed = await Promise.all(
        liked.map(({ id }) => fetchReviewById(id)),
      );
      setReviews(detailed.filter((r): r is Review => !!r));
      setTotalPages(totalPages);
      setLoading(false);
    })();
  }, [uid, page]);

  if (!uid) {
    return <div>로그인이 필요합니다</div>;
  }

  return (
    <div className="flex w-full flex-col">
      <main className="w-full flex-1">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-accent-300">
            Liked Ticket List
          </h1>
          <p className="text-white">좋아요를 누른 티켓 목록입니다</p>
        </div>
        <p className="mb-6 text-white">전체 {reviews.length}장</p>

        {loading ? (
          <p className="text-white">로딩 중…</p>
        ) : reviews.length > 0 ? (
          <ReviewTicket reviews={reviews} />
        ) : (
          <EmptyState message="좋아요한 티켓이 없습니다" />
        )}
      </main>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
