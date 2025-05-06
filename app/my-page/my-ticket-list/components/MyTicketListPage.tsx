"use client";

import { Review } from "api/reviews/fetchReviews";
import useReviewSearch from "hooks/useReviewSearch";
import MyTicketHeader from "app/my-page/my-ticket-list/components/MyTicketPageHeader";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import EmptyState from "app/my-page/components/EmptyState";
import Pagination from "app/components/Pagination";

interface MyTicketListPageProps {
  userReviews: Review[];
  currentPage: number;
  totalPages: number;
}

export default function MyTicketListPage({
  userReviews,
  currentPage,
  totalPages,
}: MyTicketListPageProps) {
  const { filteredReviews } = useReviewSearch(userReviews);
  const displayReviews =
    filteredReviews.length > 0 ? filteredReviews : userReviews;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="w-full flex-1 flex-col lg:flex-row">
        <MyTicketHeader userReviews={userReviews} />
        <p className="mb-6 text-white">
          전체 {userReviews.length > 0 ? userReviews.length : 0}장
        </p>
        {displayReviews.length > 0 ? (
          <ReviewTicket reviews={displayReviews} />
        ) : (
          <EmptyState message="작성한 리뷰가 없습니다" />
        )}
      </main>
      {/* 페이지네이션 */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
