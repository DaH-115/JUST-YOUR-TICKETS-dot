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
import ActivityBadge from "app/components/ActivityBadge";

export default function ReviewTicket({
  reviews,
  onLikeToggled,
}: {
  reviews: ReviewDoc[];
  onLikeToggled?: (reviewId: string, isLiked: boolean) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewDoc>();
  const [canClick, setCanClick] = useState(true);
  const { showErrorHandler } = useAlert();

  const openModalHandler = useCallback(
    (selectedReview: ReviewDoc) => {
      if (!canClick) return;
      setSelectedReview(selectedReview);
      setIsModalOpen(true);
    },
    [canClick],
  );

  const closeModalHandler = useCallback(() => {
    setIsModalOpen(false);
    setCanClick(false);
    setTimeout(() => {
      setCanClick(true);
    }, 100);
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
          onLikeToggled={onLikeToggled}
        />
      )}

      {/* 리뷰 리스트 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
        {reviews.map((data) => (
          <div
            key={data.id}
            onClick={() => openModalHandler(data)}
            className="cursor-pointer drop-shadow-md transition-transform duration-300 hover:-translate-y-1"
          >
            {/* MOVIE POSTER */}
            <div className="aspect-[2/3] overflow-hidden rounded-xl">
              <MoviePoster
                posterPath={data.review.moviePosterPath}
                title={data.review.movieTitle}
              />
            </div>

            {/* MOVIE INFO CARD */}
            <div className="w-full rounded-xl border bg-white p-2 transition-all duration-500">
              {/* 영화 타이틀 & 좋아요 */}
              <div className="flex items-center justify-between border-b-4 border-dotted px-1 py-1">
                {/* 클릭하면 영화 상세 정보로 이동 */}
                <div
                  className="truncate border-r-4 border-dotted pr-1.5 text-xs hover:underline"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Link href={`/movie-details/${data.review.movieId}`}>
                    {`${data.review.movieTitle}(${data.review.releaseYear})`}
                  </Link>
                </div>
                {/* 좋아요 카운트 */}
                <div className="flex items-center pl-1.5">
                  <FaHeart size={16} className="mr-1 text-red-500" />
                  <p className="text-xs">{data.review.likeCount}</p>
                </div>
              </div>

              {/* 리뷰 제목 */}
              <div className="flex items-center border-b-4 border-dotted px-1 py-1">
                <div className="mr-1.5 flex items-center justify-center border-r-4 border-dotted pr-1.5">
                  <IoStar className="text-accent-300" size={14} />
                  <p className="ml-1 text-xs font-bold">{data.review.rating}</p>
                </div>
                <p className="w-full truncate text-xs font-bold">
                  {data.review.reviewTitle}
                </p>
              </div>

              {/* 프로필 사진 & 닉네임 & 등급 */}
              <div className="flex items-center justify-between px-1 pt-1.5 text-xs">
                <div className="flex min-w-0 flex-1 items-center">
                  <ProfileImage
                    photoURL={data.user.photoURL || undefined}
                    userDisplayName={data.user.displayName || "사용자"}
                  />
                  <p className="min-w-0 truncate text-xs">
                    {data.user.displayName ? data.user.displayName : "Guest"}
                  </p>
                  <ActivityBadge uid={data.user.uid} size="tiny" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
