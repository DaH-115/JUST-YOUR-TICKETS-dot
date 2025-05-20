import Link from "next/link";
import ReviewCard from "app/home/components/reviews/ReviewCard";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

export default function LatestReviews({ reviews }: { reviews: ReviewDoc[] }) {
  return (
    <section className="py-8">
      <div className="mb-4 text-white">
        <h2 className="text-2xl font-bold">Latest Reviews</h2>

        <div className="flex items-center">
          <p className="text-sm">{"최근 등록된 리뷰 티켓을 확인해 보세요."}</p>
          <Link
            href="/ticket-list"
            className="ml-2 text-sm text-white hover:underline"
            aria-label="티켓 목록으로 이동"
          >
            전체 보기
          </Link>
        </div>
      </div>

      <div className="mx-auto grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
