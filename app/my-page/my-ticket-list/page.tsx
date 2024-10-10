"use client";

import { useCallback, useEffect, useState } from "react";
import { db } from "firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import SideMenu from "app/my-page/side-menu";
import { Review } from "app/ticket-list/page";
import TicketList from "app/ticket-list/ticket-list";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { IoSearchOutline } from "react-icons/io5";

export default function MySideReviewList() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
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
      })) as Review[];
      setUserReviews(reviews);
    } catch (error) {
      console.error("Error getting documents:", error);
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

  const handleReviewDeleted = () => {
    fetchUserReviews();
  };

  useEffect(() => {
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]);

  return (
    <div id="layout" className="mb-8 mt-24 flex w-full px-8">
      <SideMenu uid={uid as string} />
      <div id="side-review-list" className="w-full px-8">
        <div className="flex items-end justify-between">
          <div className="group relative inline-block w-80">
            <div className="relative z-10 h-20 w-80 rounded-xl border-2 border-black bg-white transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
              <div className="flex h-20 items-center">
                <h1 className="flex h-full flex-1 items-center justify-center border-r border-black text-2xl font-bold">
                  MY TICKET LIST
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
              >
                <IoSearchOutline size={20} color="black" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 p-6">
          <TicketList
            reviews={searchTerm ? filteredReviews : userReviews}
            onReviewDeleted={handleReviewDeleted}
          />
        </div>
      </div>
    </div>
  );
}
