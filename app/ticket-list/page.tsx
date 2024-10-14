"use client";

import { useCallback, useEffect, useState } from "react";
import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { addNewReviewAlertHandler } from "store/newReviewAlertSlice";
import TicketList from "app/ticket-list/ticket-list";
import { IoSearchOutline } from "react-icons/io5";

export interface Review {
  date: string;
  id: string;
  movieTitle: string;
  movieId: string;
  posterImage: string;
  rating: number;
  releaseYear: string;
  review: string;
  reviewTitle: string;
  userUid: string;
  userName: string;
}

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
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

  const fetchReviews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "movie-reviews"));
      const reviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
      setReviews(reviews);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const debounceSearch = useCallback(
    debounce((searchTerm: string) => {
      const filtered = reviews.filter(
        (review) =>
          review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.reviewTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredReviews(filtered);
    }, 300),
    [reviews],
  );

  useEffect(() => {
    if (newReviewAlertState) {
      const timer = setTimeout(() => {
        dispatch(addNewReviewAlertHandler());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [newReviewAlertState, dispatch]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewDeleted = () => {
    fetchReviews();
  };

  useEffect(() => {
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]);

  return (
    <div className="mt-6 px-6">
      <div className="flex-col items-center justify-center md:flex-row md:items-end md:justify-between">
        <div className="flex w-full flex-col md:flex-row">
          <div className="mb-4 flex w-full items-center justify-between md:mb-0 lg:justify-normal">
            <h1 className="text-2xl font-bold">ALL TICKET LIST</h1>
            <span className="lg:px-4">
              총 <span className="font-bold">{filteredReviews.length}</span>장
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
      </div>

      <main className="grid grid-cols-2 gap-2 pb-12 pt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-4 md:px-8 lg:grid-cols-4 xl:grid-cols-5">
        <TicketList
          reviews={searchTerm ? filteredReviews : reviews}
          onReviewDeleted={handleReviewDeleted}
        />
      </main>
    </div>
  );
}
