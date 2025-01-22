"use client";

import { useEffect } from "react";
import SideMenu from "app/my-page/side-menu";
import { UserReview } from "api/movie-reviews/fetchUserReviews";
import { useForm } from "react-hook-form";
import ReviewSearchInputregister from "app/components/reviewTicketList/review-search-Input";
import ReviewTicket from "app/components/reviewTicketList/review-ticket";
import useReviewSearch from "hooks/useReviewSearch";

export default function MyTicktListPage({
  userReviews,
  uid,
}: {
  uid: string;
  userReviews: UserReview[];
}) {
  const { filteredUserReviews, searchReviewsHandler } =
    useReviewSearch(userReviews);
  const { register, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const searchTerm = watch("search");

  useEffect(() => {
    searchReviewsHandler(searchTerm);
  }, [searchTerm, searchReviewsHandler]);

  return (
    <div className="flex w-full flex-col p-8 lg:flex-row">
      <SideMenu uid={uid || ""} />
      <main className="flex w-full flex-col">
        <header className="flex items-center border-t-2 border-t-accent-500 pb-8 pt-6 lg:border-t-0">
          {/* 티켓 개수 */}
          <div className="flex items-center font-bold">
            <h1 className="text-xl text-white">All</h1>
            <div className="px-2 text-2xl text-accent-300">
              {filteredUserReviews.length}
            </div>
          </div>
          {/* 티켓 검색 */}
          <ReviewSearchInputregister
            label="티켓 검색"
            register={register}
            placeholder="티켓 검색"
          />
        </header>
        {/* 티켓 목록 */}
        <div className="h-full w-full">
          {userReviews.length > 0 ? (
            <ReviewTicket
              reviews={!filteredUserReviews ? userReviews : filteredUserReviews}
            />
          ) : (
            <div className="flex items-center justify-center text-center text-sm font-bold text-gray-300">
              등록된 리뷰 티켓이 없습니다.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
