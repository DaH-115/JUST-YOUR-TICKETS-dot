"use client";

import { db } from "firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  movieTitle: string;
  reviewTitle: string;
  date: string;
  releaseYear: string;
  rating: number;
  userUid: string;
}

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
    <div id="side-review-list" className="w-full px-8">
      <div className="flex items-center">
        <div className="mr-4 text-2xl font-bold">REVIEW LIST</div>
        <div className="mr-4">총 {userReviews.length}개</div>
        <Link href={`/my-page/my-review-list?uid=${uid}`}>
          <div className="font-bold">전체보기</div>
        </Link>
      </div>
      <ul className="space-y-4">
        {userReviews.map((review, index) => (
          <li
            key={review.id}
            className="flex items-center border-b-2 border-black p-4"
          >
            <div className="mr-4">{index + 1}</div>
            <div>
              <div className="text-sm">{review.date}</div>
              <div className="font-bold">{review.reviewTitle}</div>
              <div className="flex text-sm text-gray-500">
                <div>{`${review.movieTitle} - ${review.releaseYear}`}</div>
                <div>{review.rating}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
