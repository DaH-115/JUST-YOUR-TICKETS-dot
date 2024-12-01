"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";
import fetchMovieReviews, {
  MovieReview,
} from "api/movie-reviews/fetchMovieReviews";
import { firebaseErrorHandler } from "app/my-page/utils/firebase-error";
import { addNewReviewAlertHandler } from "store/newReviewAlertSlice";
import TicketList from "app/ticket-list/ticket-list";
import { IoSearchOutline } from "react-icons/io5";
import useReviewSearch from "app/ticket-list/utils/useReviewSearch";

export default function TicketListPage() {
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
    try {
      const movieReviews = await fetchMovieReviews();
      setUserReviews(movieReviews);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorInfo = firebaseErrorHandler(error);
        window.alert(`${errorInfo.title}: ${errorInfo.message}`);
      } else {
        window.alert("티켓을 불러오는 중 오류가 발생했습니다.");
      }
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    searchReviewsHandler(searchTerm);
  }, [searchTerm, searchReviewsHandler]);

  return (
    <div className="w-full px-8 md:mt-6">
      <section className="flex w-full flex-col items-center pb-6 md:flex-row">
        <div className="mb-4 mt-8 flex w-full items-center justify-between md:mb-0 md:mt-0 md:justify-normal">
          <h1 className="text-2xl font-bold">ALL TICKETS</h1>
          <span className="md:px-4">
            총 <span className="font-bold">{filteredUserReviews.length}</span>장
          </span>
        </div>
        {/* 티켓 검색 */}
        <div className="relative flex h-10 w-full items-center justify-end">
          <label htmlFor="review-search" className="sr-only">
            리뷰 검색
          </label>
          <input
            {...register("search")}
            id="review-search"
            type="search"
            placeholder="티켓 검색"
            className="h-full w-full rounded-full border-2 border-black pl-4 pr-10 text-sm opacity-100 md:w-64"
          />
          <div
            className={`absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center justify-center rounded-full`}
          >
            <IoSearchOutline size={20} color="black" />
          </div>
        </div>
      </section>
      {/* 티켓 목록 */}
      {filteredUserReviews ? (
        <main className="grid grid-cols-1 gap-2 pb-8 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          <TicketList
            reviews={filteredUserReviews}
            onReviewUpdated={fetchReviews}
          />
        </main>
      ) : (
        <div className="p-8 text-center text-sm font-bold text-gray-300 md:pt-60 md:text-xl">
          리뷰가 없습니다
        </div>
      )}
    </div>
  );
}
