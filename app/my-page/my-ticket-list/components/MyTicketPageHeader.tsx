"use client";

import { useEffect } from "react";
import useReviewSearch from "hooks/useReviewSearch";
import { Review } from "lib/reviews/fetchReviews";
import { useForm } from "react-hook-form";
import ReviewSearchInput from "app/components/reviewTicket/ReviewSearchInput";

export default function MyTicketHeader({
  userReviews,
}: {
  userReviews: Review[];
}) {
  const { register, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const searchTerm = watch("search");
  const { searchReviewsHandler } = useReviewSearch(userReviews);

  useEffect(() => {
    searchReviewsHandler(searchTerm);
  }, [searchTerm, searchReviewsHandler]);

  return (
    <header className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-accent-300">My Ticket List</h1>
        <p className="text-white">내가 작성한 티켓 목록입니다</p>
      </div>
      {/* 티켓 검색 */}
      <ReviewSearchInput
        label="티켓 검색"
        register={register}
        placeholder="티켓 검색"
      />
    </header>
  );
}
