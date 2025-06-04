"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { IoStar } from "react-icons/io5";
import { deleteReview } from "app/actions/deleteReview";
import ReviewDetailsModal from "app/components/reviewTicket/ReviewDetailsModal";
import MoviePoster from "app/components/MoviePoster";
import ProfileImage from "app/components/reviewTicket/ProfileImage";
import { useAlert } from "store/context/alertContext";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import { FaHeart } from "react-icons/fa";

export default function ReviewTicket({ reviews }: { reviews: ReviewDoc[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewDoc>();
  const { showErrorHandler } = useAlert();

  const openModalHandler = useCallback((selectedReview: ReviewDoc) => {
    setSelectedReview(selectedReview);
    setIsModalOpen(true);
  }, []);

  const closeModalHandler = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onReviewDeleteHanlder = useCallback(
    async (id: string) => {
      const confirmed = window.confirm("정말 삭제하시겠습니까?");
      if (!confirmed) return;

      try {
        await deleteReview(id);
        closeModalHandler();
      } catch (error) {
        if (error instanceof Error) {
          console.error("리뷰 티켓 삭제 중 오류 발생:", error.message);
          showErrorHandler("오류", error.message);
        } else {
          const { title, message } = firebaseErrorHandler(error);
          showErrorHandler(title, message);
        }
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
          onReviewDeleted={onReviewDeleteHanlder}
        />
      )}
      {/* 리뷰 리스트 */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
        {reviews.map((data) => (
          <div
            key={data.id}
            onClick={() => openModalHandler(data)}
            className="mb-16 cursor-pointer drop-shadow-md transition-transform duration-300 hover:-translate-y-1"
          >
            {/* MOVIE POSTER */}
            <div className="aspect-[2/3] overflow-hidden rounded-xl">
              <MoviePoster
                posterPath={data.review.moviePosterPath}
                title={data.review.movieTitle}
                size={342}
              />
            </div>

            {/* MOVIE INFO CARD */}
            <div className="w-full rounded-lg border bg-white p-2 transition-all duration-500 md:-bottom-16">
              {/* 영화 타이틀 & 좋아요 */}
              <div className="flex items-center justify-between border-b-4 border-dotted px-2">
                {/* 클릭하면 영화 상세 정보로 이동 */}
                <div
                  className="truncate border-r-4 border-dotted pr-2 text-xs font-bold hover:underline"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Link href={`/movie-details/${data.review.movieId}`}>
                    {`${data.review.movieTitle}(${data.review.releaseYear})`}
                  </Link>
                </div>
                {/* 좋아요 카운트 */}
                <FaHeart size={32} className="mr-1 pl-2 text-red-500" />
                <p>{data.review.likeCount}</p>
              </div>

              {/* 리뷰 제목 */}
              <div className="flex items-center border-b-4 border-dotted p-1">
                <div className="mr-2 flex items-center justify-center border-r-4 border-dotted pr-2">
                  <IoStar className="text-accent-300" />
                  <p className="font-bold">{data.review.rating}</p>
                </div>
                <p className="w-full truncate text-sm">
                  {data.review.reviewTitle}
                </p>
              </div>

              {/* 프로필 사진 & 닉네임 & 작성 시간 */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <div className="flex w-full items-center">
                  <ProfileImage
                    photoURL={data.user.photoURL || undefined}
                    userDisplayName={data.user.displayName || "사용자"}
                  />
                  <div className="w-full">
                    {data.user.displayName ? data.user.displayName : "Guest"}
                  </div>
                </div>
                <p className="w-full truncate">{data.review.createdAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
