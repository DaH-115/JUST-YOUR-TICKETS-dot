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
    <div className="w-3/4 px-8">
      <div className="flex items-center">
        <div className="mr-4 text-2xl font-bold">TICKET LIST</div>
        <div className="mr-4">총 {userReviews.length}개</div>
        <Link href={`/my-page/my-ticket-list?uid=${uid}`}>
          <div className="rounded-full px-2 py-1 text-xs font-bold text-gray-500 transition-all duration-200 hover:bg-black hover:text-white focus:outline-none">
            전체보기
          </div>
        </Link>
      </div>
      <ul className="space-y-4">
        {userReviews.map((review, index) => (
          <li
            key={review.id}
            className="flex items-center border-b-2 border-gray-300 p-4"
          >
            <p className="mr-4 rounded-full border-2 border-black bg-white px-4 py-2 font-bold">
              {index + 1}
            </p>
            <div>
              <div className="text-sm">{review.date}</div>
              <div className="font-bold">{review.reviewTitle}</div>
              <div className="flex items-center text-sm text-gray-500">
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
  );
}
