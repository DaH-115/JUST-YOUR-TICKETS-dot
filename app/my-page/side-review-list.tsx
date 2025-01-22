import Link from "next/link";
import { UserReview } from "api/movie-reviews/fetchUserReviews";
import { IoStar } from "react-icons/io5";
import formatDate from "app/utils/format-date";
import { BackAnimation } from "app/ui/back-animation";

export default function SideReviewList({
  uid,
  userReviews,
}: {
  uid: string;
  userReviews: UserReview[];
}) {
  const filteredUserReviews = userReviews.filter(
    (review) => review.userUid === uid,
  );

  return (
    <section className="group relative hidden lg:ml-8 lg:block lg:w-3/5">
      <div className="absolute inset-0 overflow-y-auto rounded-xl border-2 border-black bg-white p-4 px-8 transition-all duration-300 scrollbar-hide group-hover:-translate-x-1 group-hover:-translate-y-1">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="text-nowrap">
            <h2 className="text-lg font-bold">MY TICKETS</h2>
          </div>
          <Link href={`/my-page/my-ticket-list?uid=${uid}`}>
            <div className="text-nowrap rounded-full px-2 py-1 text-xs text-black transition-all duration-300 hover:bg-black hover:text-white focus:outline-none">
              전체보기
            </div>
          </Link>
        </div>
        {filteredUserReviews.length > 0 ? (
          <ul className="py-1">
            {filteredUserReviews.map((review) => (
              <li
                key={review.id}
                className="flex items-center border-b border-gray-300 py-2"
              >
                <div className="w-full text-xs">
                  <div>{formatDate(review.date)}</div>

                  <h3 className="font-bold">
                    {`${review.number}. ${review.reviewTitle}`}
                  </h3>
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
