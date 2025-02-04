"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserReview } from "api/movie-reviews/fetchUserReviews";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import useReviewSearch from "hooks/useReviewSearch";
import { addNewReviewAlertHandler } from "store/redux-toolkit/slice/newReviewAlertSlice";
import ReviewSearchInputregister from "app/components/reviewTicketList/review-search-Input";
import ReviewTicket from "app/components/reviewTicketList/review-ticket";

export default function TicketListPage({
  userReviews,
}: {
  userReviews: UserReview[];
}) {
  const newReviewAlertState = useAppSelector(
    (state) => state.newReviewAlert.newReviewAlertState,
  );
  const dispatch = useAppDispatch();
  const { register, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const searchTerm = watch("search");
  const { filteredUserReviews, searchReviewsHandler } =
    useReviewSearch(userReviews);

  useEffect(() => {
    if (newReviewAlertState) {
      const timer = setTimeout(() => {
        dispatch(addNewReviewAlertHandler());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [newReviewAlertState, dispatch]);

  useEffect(() => {
    searchReviewsHandler(searchTerm);
  }, [searchTerm, searchReviewsHandler]);

  return (
    <main className="mb-8 w-full px-4 md:px-8">
      <section className="flex w-full flex-col items-center pb-8 md:flex-row">
        <div className="mb-4 mt-8 flex w-full items-center justify-between text-white md:mb-0 md:mt-0 md:justify-normal">
          <h1 className="text-2xl font-bold">ALL TICKETS</h1>
          <span className="md:px-4">
            <span className="font-bold text-accent-300">
              {filteredUserReviews.length}장
            </span>
          </span>
        </div>
        {/* 티켓 검색 */}
        <ReviewSearchInputregister
          label="티켓 검색"
          register={register}
          placeholder="티켓 검색"
        />
      </section>
      {/* 티켓 목록 */}
      {userReviews.length > 0 ? (
        <ReviewTicket
          reviews={!filteredUserReviews ? userReviews : filteredUserReviews}
        />
      ) : (
        <div className="flex h-96 w-full items-center justify-center text-center text-lg font-bold text-gray-500">
          등록된 리뷰 티켓이 없습니다.
        </div>
      )}
    </main>
  );
}
