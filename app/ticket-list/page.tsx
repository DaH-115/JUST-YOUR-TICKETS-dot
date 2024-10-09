"use client";

import { useCallback, useEffect, useState } from "react";
import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { addNewReviewAlertHandler } from "store/newReviewAlertSlice";
import TicketList from "app/ticket-list/ticket-list";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const newReviewAlertState = useAppSelector(
    (state) => state.newReviewAlert.newReviewAlertState,
  );
  const dispatch = useAppDispatch();

  const { register, watch, reset } = useForm({
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

  useEffect(() => {
    newReviewAlertState && dispatch(addNewReviewAlertHandler());
  }, [newReviewAlertState, dispatch]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewDeleted = () => {
    fetchReviews();
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
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]);

  const handleIconClick = () => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setTimeout(
        () =>
          (
            document.querySelector('input[type="search"]') as HTMLInputElement
          )?.focus(),
        300,
      );
    }
  };

  return (
    <div className="mt-6 px-6">
      <div className="flex items-end justify-between">
        <div className="group relative inline-block w-80">
          <div className="relative z-10 h-20 w-80 rounded-xl border-2 border-black bg-white transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
            <div className="flex h-20 items-center">
              <h1 className="flex h-full flex-1 items-center justify-center border-r border-black text-2xl font-bold">
                ALL TICKET LIST
              </h1>
              <span className="px-4 font-bold">
                총 {filteredReviews.length}장
              </span>
            </div>
          </div>
          <div className="absolute left-1 top-1 -z-10 h-20 w-80 rounded-xl border-2 border-black bg-black transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:bg-gray-200"></div>
        </div>

        <div className="flex h-10">
          <div className="relative flex h-full w-full items-center justify-end">
            <input
              {...register("search")}
              type="search"
              placeholder="리뷰 검색"
              className="h-full w-64 rounded-full border-2 border-black pl-4 pr-10 text-sm opacity-100"
            />
            <div
              className={`absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center justify-center rounded-full border-none bg-none`}
              onClick={handleIconClick}
            >
              <IoSearchOutline size={20} color="black" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-6 pb-12 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <TicketList
          reviews={searchTerm ? filteredReviews : reviews}
          onReviewDeleted={handleReviewDeleted}
        />
      </div>
    </div>
  );
}
