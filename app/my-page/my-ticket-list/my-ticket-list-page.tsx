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
    <div className="flex w-full flex-col lg:mt-8 lg:flex-row">
      <SideMenu uid={uid || ""} />
      <main className="flex w-full flex-col">
        <header className="mb-6 flex-col items-center justify-center px-8 md:flex-row md:items-end md:justify-between lg:px-0">
          <div className="flex w-full flex-col md:flex-row">
            <div className="flex w-full items-center">
              <h1 className="hidden text-2xl font-bold text-white md:block">
                MY TICKETS
              </h1>
              <div className="py-2 md:px-4">
                <span className="text-accent-300 font-bold">
                  {filteredUserReviews.length}
                </span>
              </div>
            </div>
            {/* 티켓 검색 */}
            <ReviewSearchInputregister
              label="티켓 검색"
              register={register}
              placeholder="티켓 검색"
            />
          </div>
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
