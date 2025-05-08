import Link from "next/link";
import { Review } from "lib/reviews/fetchReviews";
import ReviewCard from "app/home/components/reviews/ReviewCard";
import { FaArrowRight } from "react-icons/fa";

export default function LatestReviews({ reviews }: { reviews: Review[] }) {
  return (
    <section className="mt-16">
      <h2 className="mb-8 flex items-center text-2xl font-bold text-accent-300 md:text-4xl">
        Latest Reviews
        <Link
          href="/ticket-list"
          className="ml-2 flex items-center justify-center rounded-full border-2 border-accent-300 p-2 transition-all hover:bg-accent-300 hover:text-white"
          aria-label="티켓 목록으로 이동"
        >
          <FaArrowRight size={20} />
        </Link>
      </h2>
      <div className="grid gap-4 px-8">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
