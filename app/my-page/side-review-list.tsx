"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { MovieReview } from "api/movie-reviews/fetchMovieReviews";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import { IoStar } from "react-icons/io5";
import { useError } from "store/error-context";

export default function SideReviewList({ uid }: { uid: string }) {
  const [userReviews, setUserReviews] = useState<MovieReview[]>([]);
  const { isShowError } = useError();

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const reviewsRef = collection(db, "movie-reviews");
        const userReviewsQuery = query(reviewsRef, where("userUid", "==", uid));
        const querySnapshot = await getDocs(userReviewsQuery);

        if (querySnapshot.empty) {
          setUserReviews([]);
        } else {
          const reviews = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as MovieReview[];
          setUserReviews(reviews);
        }
      } catch (error) {
        const { title, message } = firebaseErrorHandler(error);
        isShowError(title, message);
      }
    };

    fetchUserReviews();
  }, [uid]);

  return (
    <section className="group relative hidden lg:ml-8 lg:block lg:w-3/5">
      <div className="absolute inset-0 overflow-y-auto rounded-xl border-2 border-black bg-white p-4 px-8 transition-all duration-300 scrollbar-hide group-hover:-translate-x-1 group-hover:-translate-y-1">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <h2 className="text-lg font-bold">MY TICKETS</h2>
          <div className="text-nowrap text-xs">
            총 <span className="font-bold">{userReviews.length}</span>개
          </div>
          <Link href={`/my-page/my-ticket-list?uid=${uid}`}>
            <div className="text-nowrap rounded-full px-2 py-1 text-xs text-black transition-all duration-300 hover:bg-black hover:text-white focus:outline-none">
              전체보기
            </div>
          </Link>
        </div>
        {userReviews && userReviews.length > 0 ? (
          <ul className="py-1">
            {userReviews.map((review, index) => (
              <li
                key={review.id}
                className="flex items-center border-b border-gray-300 p-2"
              >
                <p className="mr-4 rounded-full border border-black bg-white px-2 py-1 text-xs font-bold">
                  {index + 1}
                </p>
                <div className="w-full text-xs">
                  <div>{review.date}</div>
                  <h3 className="font-bold">{review.reviewTitle}</h3>
                  <div className="flex w-full items-center justify-between text-gray-500">
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
        ) : (
          <div className="py-4 text-xs text-gray-500">등록된 리뷰 없음</div>
        )}
      </div>
      <span className="absolute left-1 top-1 -z-10 h-full w-full rounded-xl border-2 border-black bg-black transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:bg-gray-200" />
    </section>
  );
}
