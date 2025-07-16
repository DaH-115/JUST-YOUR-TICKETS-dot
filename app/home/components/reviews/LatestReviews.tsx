"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import ReviewCard from "app/home/components/reviews/ReviewCard";
import { ReviewDoc, ReviewWithLike } from "lib/reviews/fetchReviewsPaginated";

export default function LatestReviews({
  reviews: initialReviews,
}: {
  reviews: ReviewDoc[];
}) {
  const [navigatingReviewId, setNavigatingReviewId] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const reviewsWithLike: ReviewWithLike[] = initialReviews.map((review) => ({
    ...review,
    isLiked: false,
  }));

  const onReviewClickHandler = useCallback(
    (reviewId: string) => {
      setNavigatingReviewId(reviewId);
      router.push(`/ticket-list?reviewId=${reviewId}`);
    },
    [router],
  );

  return (
    <>
      <section className="py-8 md:py-16">
        <div className="mb-6 md:mb-4">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
            Latest Reviews
          </h2>

          <div className="flex items-center">
            <p className="text-sm text-gray-300">
              {"최근 등록된 리뷰 티켓을 확인해 보세요"}
            </p>
            <Link
              href="/ticket-list"
              className="ml-2 text-sm text-accent-300 transition-colors duration-300 hover:text-accent-200"
            >
              모든 리뷰 티켓 보기
            </Link>
          </div>
        </div>

        <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 md:py-4 lg:grid-cols-3">
          {reviewsWithLike.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReviewClick={onReviewClickHandler}
              isNavigating={navigatingReviewId === review.id}
            />
          ))}
        </div>
      </section>
    </>
  );
}
