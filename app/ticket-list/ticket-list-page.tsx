"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";
import fetchMovieReviews, {
  MovieReview,
} from "api/movie-reviews/fetchMovieReviews";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import { addNewReviewAlertHandler } from "store/newReviewAlertSlice";
import useReviewSearch from "app/utils/useReviewSearch";
import ReviewTicket from "app/ui/reviewTicketList/review-ticket";
import ReviewSearchInputregister from "app/ui/reviewTicketList/review-search-Input";
import ReviewListSkeleton from "app/ticket-list/review-list-skeleton";

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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    searchReviewsHandler(searchTerm);
  }, [searchTerm, searchReviewsHandler]);

  return (
    <main className="w-full px-8 md:mt-6">
      <section className="flex w-full flex-col items-center pb-6 md:flex-row">
        <div className="mb-4 mt-8 flex w-full items-center justify-between text-white md:mb-0 md:mt-0 md:justify-normal">
          <h1 className="text-2xl font-bold">ALL TICKETS</h1>
          <span className="md:px-4">
            <span className="font-bold text-[#D4AF37]">
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
      {isLoading ? (
        <ReviewListSkeleton />
      ) : userReviews.length > 0 ? (
        <ReviewTicket
          reviews={!filteredUserReviews ? userReviews : filteredUserReviews}
          onReviewUpdated={fetchReviews}
        />
      ) : (
        <div className="flex h-96 w-full items-center justify-center text-center text-lg font-bold text-gray-500">
          등록된 리뷰 티켓이 없습니다.
        </div>
      )}
    </main>
  );
}
