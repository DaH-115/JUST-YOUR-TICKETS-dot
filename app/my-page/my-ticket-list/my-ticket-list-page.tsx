"use client";

import { useCallback, useEffect, useState } from "react";
import { db } from "firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import SideMenu from "app/my-page/side-menu";
import { MovieReview } from "api/movie-reviews/fetchMovieReviews";
import TicketList from "app/ticket-list/ticket-list";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { IoSearchOutline } from "react-icons/io5";
import { firebaseErrorHandler } from "app/my-page/utils/firebase-error";
import { useError } from "store/error-context";

export default function MyTicktListPage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [userReviews, setUserReviews] = useState<MovieReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<MovieReview[]>([]);
  const { isShowError } = useError();
  const { register, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const searchTerm = watch("search");

  const fetchUserReviews = async () => {
    try {
      const reviewsRef = collection(db, "movie-reviews");
      const userReviewsQuery = query(reviewsRef, where("userUid", "==", uid));
      const querySnapshot = await getDocs(userReviewsQuery);
      const reviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MovieReview[];
      setUserReviews(reviews);
    } catch (error: any) {
      const { title, message } = firebaseErrorHandler(error);
      isShowError(title, message);
    }
  };

  const debounceSearch = useCallback(
    debounce((searchTerm: string) => {
      const filtered = userReviews.filter(
        (userReview) =>
          userReview.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userReview.reviewTitle
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          userReview.movieTitle
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
      setFilteredReviews(filtered);
    }, 300),
    [userReviews],
  );

  useEffect(() => {
    if (!uid) return;
    fetchUserReviews();
  }, [uid]);

  useEffect(() => {
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]);

  return (
    <div className="flex w-full flex-col lg:my-8 lg:mb-8 lg:flex-row lg:px-8">
      <div className="w-1/3">
        <SideMenu uid={uid as string} />
      </div>
      <main className="flex w-full flex-col">
        <div className="mb-6 flex-col items-center justify-center px-8 md:flex-row md:items-end md:justify-between lg:px-0">
          <div className="flex w-full flex-col md:flex-row">
            <div className="mb-4 flex w-full items-center justify-between md:mb-0 lg:justify-normal">
              <h1 className="hidden text-2xl font-bold md:block">
                MY TICKET LIST
              </h1>
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
        <section className="px-8 lg:px-0">
          <div className="grid grid-cols-2 gap-2 pb-12 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            <TicketList
              reviews={searchTerm ? filteredReviews : userReviews}
              onReviewUpdated={fetchUserReviews}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
