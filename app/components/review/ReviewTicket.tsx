"use client";

import Link from "next/link";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import ActivityBadge from "app/components/ui/feedback/ActivityBadge";
import MoviePoster from "app/components/movie/MoviePoster";
import ProfileAvatar from "app/components/user/ProfileAvatar";
import ReviewDetailsModal from "app/components/review/ReviewDetailsModal";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import { useReviews } from "app/components/review/hooks/useReviews";
import { useLikeToggle } from "app/components/review/hooks/useLikeToggle";
import { useReviewModal } from "app/components/review/hooks/useReviewModal";
import { useReviewDelete } from "app/components/review/hooks/useReviewDelete";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { ImSpinner2 } from "react-icons/im";

interface ReviewTicketProps {
  reviews: ReviewDoc[];
  reviewId?: string | null;
  onLikeToggled?: (
    reviewId: string,
    newLikeCount: number,
    isLiked: boolean,
  ) => void;
}

export default function ReviewTicket({
  reviews: initialReviews,
  reviewId,
  onLikeToggled,
}: ReviewTicketProps) {
  const userState = useAppSelector(selectUser);

  // 리뷰 데이터 상태 관리
  const { reviews, isLoading, setReviews } = useReviews(initialReviews);

  // 모달 상태 관리
  const {
    isModalOpen,
    selectedReview,
    setSelectedReview,
    openModalHandler,
    closeModalHandler,
  } = useReviewModal(reviews, reviewId, isLoading);

  // 좋아요 토글 기능
  const { likingReviewId, likeToggleHandler } = useLikeToggle(
    reviews,
    setReviews,
    selectedReview,
    setSelectedReview,
    onLikeToggled,
  );

  // 리뷰 삭제 기능
  const { reviewDeleteHandler } = useReviewDelete(closeModalHandler);

  return (
    <>
      {/* 리뷰 상세 모달 */}
      {selectedReview && (
        <ReviewDetailsModal
          selectedReview={selectedReview}
          isModalOpen={isModalOpen}
          closeModalHandler={closeModalHandler}
          onReviewDeleted={reviewDeleteHandler}
          onLikeToggle={likeToggleHandler}
        />
      )}
      {/* 리뷰 리스트 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {reviews.map((data) => (
          <article
            key={data.id}
            className="group relative flex cursor-pointer flex-col items-stretch drop-shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-2"
          >
            {/* 포스터 이미지 */}
            <div
              className="aspect-[2/3] w-full overflow-hidden rounded-xl"
              onClick={() => openModalHandler(data)}
            >
              <MoviePoster
                posterPath={data.review.moviePosterPath}
                title={data.review.movieTitle}
              />
            </div>
            {/* 정보 카드 */}
            <section className="relative z-10 mt-[-3rem] flex flex-col rounded-b-xl border bg-white p-2 text-black transition-colors duration-200 group-hover:bg-gray-200">
              {/* 프로필 사진 & 닉네임 & 등급 */}
              <div
                className="flex items-center"
                onClick={() => openModalHandler(data)}
              >
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <ProfileAvatar
                    s3photoKey={data.user.photoKey || undefined}
                    userDisplayName={data.user.displayName || "Guest"}
                    size={24}
                  />
                  <p className="min-w-0 truncate text-xs">
                    {data.user.displayName || "Guest"}
                  </p>
                </div>
                <ActivityBadge
                  activityLevel={data.user.activityLevel}
                  size="tiny"
                />
              </div>
              {/* 리뷰 제목 */}
              <div
                className="mt-2 flex items-center"
                onClick={() => openModalHandler(data)}
              >
                <div className="mr-1.5 flex items-center">
                  <FaStar className="text-accent-300" size={16} />
                  <p className="ml-1 text-sm font-bold">{data.review.rating}</p>
                </div>
                <p className="w-full truncate font-semibold">
                  {data.review.reviewTitle}
                </p>
              </div>

              {/* 영화 타이틀 & 좋아요 */}
              <div className="mt-2 flex items-center justify-between border-t-4 border-dotted pt-1.5">
                {/* 클릭하면 영화 상세 정보로 이동 */}
                <div
                  className="flex-1 truncate pr-1.5 text-[10px] hover:underline"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Link href={`/movie-details/${data.review.movieId}`}>
                    {`${data.review.movieTitle} (${data.review.releaseYear})`}
                  </Link>
                </div>
                {/* 좋아요 버튼 */}
                <button
                  className="flex items-center text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    likeToggleHandler(data.id);
                  }}
                  disabled={!userState?.uid || likingReviewId === data.id}
                >
                  <div className="text-xs text-red-500 transition-transform duration-200 group-hover:scale-110">
                    {data.isLiked ? (
                      <FaHeart data-testid={`like-button-filled-${data.id}`} />
                    ) : (
                      <FaRegHeart
                        data-testid={`like-button-empty-${data.id}`}
                      />
                    )}
                  </div>
                  <div className="ml-1 flex items-center justify-center">
                    {likingReviewId === data.id ? (
                      <ImSpinner2 className="animate-spin" />
                    ) : (
                      <span className="text-center">
                        {data.review.likeCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </section>
          </article>
        ))}
      </div>
    </>
  );
}
