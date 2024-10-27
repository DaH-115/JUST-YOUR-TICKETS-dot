"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { useForm } from "react-hook-form";
import fetchMovieReviews, {
  MovieReview,
} from "api/movie-reviews/fetchMovieReviews";
import { addNewReviewAlertHandler } from "store/newReviewAlertSlice";
import TicketList from "app/ticket-list/ticket-list";
import { IoSearchOutline } from "react-icons/io5";
import { useError } from "store/error-context";
import useReviewSearch from "app/ticket-list/utils/useReviewSearch";

export default function Page() {
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
  const { isShowError } = useError();
  const [userReviews, setUserReviews] = useState<MovieReview[]>([]);
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

  const fetchReviews = useCallback(async () => {
    const movieReviews = await fetchMovieReviews();

    if ("errorMessage" in movieReviews) {
      movieReviews.status === 404
        ? setUserReviews([])
        : isShowError(
            movieReviews.title,
            movieReviews.errorMessage,
            movieReviews.status,
          );
    }
  }, [isShowError]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    searchReviewsHandler(searchTerm);
  }, [searchTerm, searchReviewsHandler]);

  return (
    <div className="px-6 lg:mt-6">
      <section className="flex-col items-center justify-center md:flex-row md:items-end md:justify-between">
        <div className="flex w-full flex-col md:flex-row">
          <div className="mb-4 mt-8 flex w-full items-center justify-between md:mb-0 lg:justify-normal">
            <h1 className="text-2xl font-bold">ALL TICKET LIST</h1>
            <span className="lg:px-4">
              총 <span className="font-bold">{filteredUserReviews.length}</span>
              장
            </span>
          </div>
          <div className="relative flex h-10 w-full items-center justify-end">
            <label htmlFor="review-search" className="sr-only">
              리뷰 검색
            </label>
            <input
              {...register("search")}
              id="review-search"
              type="search"
              placeholder="리뷰 검색"
              className="h-full w-full rounded-full border-2 border-black pl-4 pr-10 text-sm opacity-100 lg:w-64"
            />
            <div
              className={`absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center justify-center rounded-full border-none bg-none`}
            >
              <IoSearchOutline size={20} color="black" />
            </div>
          </div>
        </div>
      </section>
      <main className="grid grid-cols-2 gap-2 pb-12 pt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-4 md:px-8 lg:grid-cols-4 xl:grid-cols-5">
        <TicketList
          reviews={filteredUserReviews}
          onReviewUpdated={fetchReviews}
        />
      </main>
    </div>
  );
}
