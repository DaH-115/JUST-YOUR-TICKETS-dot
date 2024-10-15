"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Review } from "app/ticket-list/page";
import { IoStar } from "react-icons/io5";

export default function SideReviewList({ uid }: { uid: string }) {
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const reviewsRef = collection(db, "movie-reviews");
        const userReviewsQuery = query(reviewsRef, where("userUid", "==", uid));
        const querySnapshot = await getDocs(userReviewsQuery);

        if (querySnapshot.empty) {
          console.log("No reviews found for this user.");
          setUserReviews([]);
        } else {
          const reviews = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Review[];
          setUserReviews(reviews);
        }
      } catch (error) {
        console.error("Error getting documents:", error);
      }
    };

    fetchUserReviews();
  }, [uid]);

  return (
    <section className="group relative hidden lg:ml-8 lg:block lg:w-3/5">
      <div className="scrollbar-hide absolute inset-0 overflow-y-auto rounded-xl border-2 border-black bg-white p-4 px-8 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
        <div className="flex items-center justify-between border-b-2 border-black pb-1">
          <h2 className="mr-4 text-2xl font-bold">MY TICKET LIST</h2>
          <div className="mr-4 text-nowrap text-sm">
            총 <span className="font-bold">{userReviews.length}</span>개
          </div>
          <Link href={`/my-page/my-ticket-list?uid=${uid}`}>
            <div className="text-nowrap rounded-full px-2 py-1 text-xs font-bold text-gray-500 transition-all duration-200 hover:bg-black hover:text-white focus:outline-none">
              전체보기
            </div>
          </Link>
        </div>
        <ul className="py-4">
          {userReviews.map((review, index) => (
            <li
              key={review.id}
              className="flex items-center border-b-2 border-gray-300 p-2"
            >
              <p className="mr-4 rounded-full border border-black bg-white px-2 py-1 text-xs font-bold">
                {index + 1}
              </p>
              <div className="w-full">
                <div className="text-xs">{review.date}</div>
                <h3 className="font-bold">{review.reviewTitle}</h3>
                <div className="flex w-full items-center justify-between text-xs text-gray-500">
                  <div>{`${review.movieTitle} - ${review.releaseYear}`}</div>
                  <div className="ml-2 flex items-center justify-center font-bold">
                    <IoStar />
                    {review.rating}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <span className="absolute left-1 top-1 -z-10 h-full w-full rounded-xl border-2 border-black bg-black transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:bg-gray-200" />
    </section>
  );
}
