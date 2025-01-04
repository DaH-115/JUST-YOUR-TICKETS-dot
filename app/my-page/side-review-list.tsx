import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "firebase-config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { MovieReview } from "api/movie-reviews/fetchMovieReviews";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import { IoStar } from "react-icons/io5";
import { useError } from "store/error-context";
import formatDate from "app/utils/format-date";
import { BackAnimation } from "app/ui/back-animation";

export default function SideReviewList({ uid }: { uid: string }) {
  const [userReviews, setUserReviews] = useState<MovieReview[]>([]);
  const { isShowError } = useError();

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const reviewsRef = collection(db, "movie-reviews");
        const userReviewsQuery = query(
          reviewsRef,
          where("userUid", "==", uid),
          orderBy("date", "desc"),
        );
        const querySnapshot = await getDocs(userReviewsQuery);

        if (querySnapshot.empty) {
          setUserReviews([]);
        } else {
          const totalCount = querySnapshot.size;
          const reviews = querySnapshot.docs.map((doc, idx) => ({
            id: doc.id,
            number: totalCount - idx,
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
  }, [uid, isShowError]);

  return (
    <section className="group relative hidden lg:ml-8 lg:block lg:w-3/5">
      <div className="absolute inset-0 overflow-y-auto rounded-xl border-2 border-black bg-white p-4 px-8 transition-all duration-300 scrollbar-hide group-hover:-translate-x-1 group-hover:-translate-y-1">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="text-nowrap">
            <h2 className="text-lg font-bold">MY TICKETS</h2>
            <div className="text-xs">
              총 <span className="font-bold">{userReviews.length}</span>개
            </div>
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
                  {review.number}
                </p>
                <div className="w-full text-xs">
                  <div>{formatDate(review.date)}</div>
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
      <BackAnimation />
    </section>
  );
}
