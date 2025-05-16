import Link from "next/link";
import { Review } from "lib/reviews/fetchReviews";
import ReviewCard from "app/home/components/reviews/ReviewCard";
import { FaArrowRight } from "react-icons/fa";

export default function LatestReviews({ reviews }: { reviews: Review[] }) {
  return (
    <section className="mt-16">
      <div className="mb-8 flex items-baseline">
        <h2 className="flex items-center text-2xl font-bold text-accent-300 md:text-4xl">
          Latest Reviews
        </h2>
        <Link
          href="/ticket-list"
          className="ml-3 text-white hover:underline"
          aria-label="티켓 목록으로 이동"
        >
          전체 보기
        </Link>
      </div>
      <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
