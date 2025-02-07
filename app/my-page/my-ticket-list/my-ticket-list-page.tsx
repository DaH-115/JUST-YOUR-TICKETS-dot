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
  const myTicketList = userReviews.filter((review) => review.userUid === uid);

  const { filteredUserReviews, searchReviewsHandler } =
    useReviewSearch(myTicketList);
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
    <div className="flex w-full flex-col p-8 pb-16 pt-4 lg:flex-row">
      <SideMenu uid={uid || ""} />
      <main className="flex w-full flex-col">
        <header className="pb-8">
          <h1 className="mb-8 text-2xl font-bold text-accent-300 lg:sr-only">
            MY TICKET
            <br />
            LIST
          </h1>
          <div className="flex w-full items-center justify-end text-white">
            {/* 티켓 개수 */}
            <div className="mr-4 flex items-center gap-2 text-lg font-bold">
              all
              <p className="text-accent-300">{filteredUserReviews.length}</p>
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
              reviews={
                !filteredUserReviews ? myTicketList : filteredUserReviews
              }
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
