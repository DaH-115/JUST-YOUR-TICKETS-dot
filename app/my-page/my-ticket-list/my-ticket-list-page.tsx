"use client";

import { useCallback, useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { db } from "firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import SideMenu from "app/my-page/side-menu";
import { MovieReview } from "api/movie-reviews/fetchMovieReviews";
import { useForm } from "react-hook-form";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import ReviewSearchInputregister from "app/ui/reviewTicketList/review-search-Input";
import ReviewTicket from "app/ui/reviewTicketList/review-ticket";
import useReviewSearch from "app/utils/useReviewSearch";

export default function MyTicktListPage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [userReviews, setUserReviews] = useState<MovieReview[]>([]);
  const { filteredUserReviews, searchReviewsHandler } =
    useReviewSearch(userReviews);
  const { register, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const searchTerm = watch("search");

  const fetchUserReviews = useCallback(async () => {
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
      if (error instanceof FirebaseError) {
        const errorInfo = firebaseErrorHandler(error);
        window.alert(`${errorInfo.title}: ${errorInfo.message}`);
      } else {
        window.alert("티켓을 불러오는 중 오류가 발생했습니다.");
      }
    }
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    fetchUserReviews();
  }, [uid]);

  useEffect(() => {
    searchReviewsHandler(searchTerm);
  }, [searchTerm, searchReviewsHandler]);

  return (
    <div className="flex w-full flex-col lg:my-8 lg:mb-8 lg:flex-row lg:px-8">
      <SideMenu uid={uid as string} />
      <main className="flex w-full flex-col">
        <section className="mb-6 flex-col items-center justify-center px-8 md:flex-row md:items-end md:justify-between lg:px-0">
          <div className="flex w-full flex-col md:flex-row">
            <div className="flex w-full items-center">
              <h1 className="hidden text-2xl font-bold md:block">MY TICKETS</h1>
              <span className="py-2 text-sm md:px-4">
                총
                <span className="font-bold">{filteredUserReviews.length}</span>
                장
              </span>
            </div>
            {/* 티켓 검색 */}
            <ReviewSearchInputregister
              label="티켓 검색"
              register={register}
              placeholder="티켓 검색"
            />
          </div>
        </section>
        {/* 티켓 목록 */}
        <section className="px-8 lg:px-0">
          <ReviewTicket
            reviews={filteredUserReviews}
            onReviewUpdated={fetchUserReviews}
          />
        </section>
      </main>
    </div>
  );
}
