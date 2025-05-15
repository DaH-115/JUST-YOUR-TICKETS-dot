"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";
import MyTicketHeader from "app/my-page/components/MyTicketPageHeader";
import SearchForm from "app/components/SearchForm";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import Pagination from "app/components/Pagination";
import EmptyState from "app/my-page/components/EmptyState";
import Loading from "app/loading";
import { Review } from "lib/reviews/fetchReviews";

const PAGE_SIZE = 10;

export default function MyTicketListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // 1) URL에서 파싱
  const uid = params.get("uid") || "";
  const currentPage = parseInt(params.get("page") || "1", 10);
  const searchTerm = params.get("search") || "";

  // 2) 로컬 상태: 패칭 결과
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 3) URL(uid,page,search)가 바뀔 때마다 데이터 페칭
  useEffect(() => {
    if (!uid) return;
    setLoading(true);

    try {
      const fetchReviews = async () => {
        const { reviews, totalPages } = await fetchReviewsPaginated({
          uid,
          page: currentPage,
          pageSize: PAGE_SIZE,
          search: searchTerm || undefined,
        });
        setUserReviews(reviews);
        setTotalPages(totalPages);
      };

      fetchReviews();
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [uid, currentPage, searchTerm]);

  // 4) 검색 → URL 교체
  const searchHandler = (searchTerm: string) => {
    router.replace(
      `${pathname}?uid=${uid}&search=${encodeURIComponent(searchTerm)}&page=1`,
    );
  };

  // 5) 페이지 변경 → URL 교체
  const pageChangeHandler = (page: number) => {
    router.push(
      `${pathname}?uid=${uid}&search=${encodeURIComponent(
        searchTerm,
      )}&page=${page}`,
    );
  };

  return (
    <div className="flex flex-col">
      <main className="w-full flex-1 flex-col lg:flex-row">
        <MyTicketHeader
          title="My Ticket List"
          content="내가 작성한 티켓 목록입니다"
          userReviews={userReviews}
        />
        <div className="mb-4 flex justify-end">
          <SearchForm placeholder="티켓 검색" onSearch={searchHandler} />
        </div>
        {loading ? (
          <Loading />
        ) : userReviews.length > 0 ? (
          <ReviewTicket reviews={userReviews} />
        ) : (
          <EmptyState message="작성한 리뷰가 없습니다" />
        )}
      </main>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={pageChangeHandler}
      />
    </div>
  );
}
