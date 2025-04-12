"use client";

import { Review } from "api/reviews/fetchReviews";
import useReviewSearch from "hooks/useReviewSearch";
import MyTicketHeader from "app/my-page/my-ticket-list/components/MyTicketPageHeader";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import EmptyState from "app/my-page/components/EmptyState";

export default function MyTicketListPage({
  userReviews,
}: {
  userReviews: Review[];
}) {
  const { filteredUserReviews } = useReviewSearch(userReviews);
  const displayReviews =
    filteredUserReviews.length > 0 ? filteredUserReviews : userReviews;

  return (
    <main className="flex w-full flex-col lg:flex-row">
      <MyTicketHeader userReviews={userReviews} />
      <p className="mb-2 text-white">
        전체 {userReviews.length > 0 ? userReviews.length : 0}장
      </p>
      {displayReviews.length > 0 ? (
        <ReviewTicket reviews={displayReviews} />
      ) : (
        <EmptyState message="작성한 리뷰가 없습니다" />
      )}
    </main>
  );
}
