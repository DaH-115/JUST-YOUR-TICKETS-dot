"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import ReviewCard from "app/home/components/reviews/ReviewCard";
import ReviewDetailsModal from "app/components/reviewTicket/ReviewDetailsModal";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

export default function LatestReviews({ reviews }: { reviews: ReviewDoc[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewDoc>();

  const openModalHandler = useCallback((selectedReview: ReviewDoc) => {
    setSelectedReview(selectedReview);
    setIsModalOpen(true);
  }, []);

  const closeModalHandler = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onReviewDeleteHandler = useCallback(
    async (id: string) => {
      const confirmed = window.confirm("정말 삭제하시겠습니까?");
      if (!confirmed) return;

      try {
        // 여기서는 삭제 기능을 구현하지 않고 모달만 닫습니다
        // 필요시 deleteReview 액션을 import하여 사용할 수 있습니다
        closeModalHandler();
      } catch (error) {
        console.error("리뷰 삭제 중 오류 발생:", error);
      }
    },
    [closeModalHandler],
  );

  return (
    <>
      {/* 리뷰 상세 모달 */}
      {selectedReview && (
        <ReviewDetailsModal
          selectedReview={selectedReview}
          isModalOpen={isModalOpen}
          closeModalHandler={closeModalHandler}
          onReviewDeleted={onReviewDeleteHandler}
        />
      )}

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
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReviewClick={openModalHandler}
            />
          ))}
        </div>
      </section>
    </>
  );
}
