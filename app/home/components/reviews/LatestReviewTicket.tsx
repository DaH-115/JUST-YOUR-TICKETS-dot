import Link from "next/link";
import { FaHeart, FaStar } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import ActivityBadge from "app/components/ui/feedback/ActivityBadge";
import MoviePoster from "app/components/movie/MoviePoster";
import ProfileAvatar from "app/components/user/ProfileAvatar";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import { useCallback } from "react";

interface LatestReviewTicketProps {
  review: ReviewDoc;
  onReviewClick: (reviewId: string) => void;
  isNavigating?: boolean;
}

export default function LatestReviewTicket({
  review,
  onReviewClick,
  isNavigating = false,
}: LatestReviewTicketProps) {
  const { user, review: content } = review;

  const reviewTitleClick = useCallback(() => {
    onReviewClick(review.id);
  }, [onReviewClick, review.id]);

  return (
    <article className="flex transform-gpu items-stretch transition-transform duration-300 hover:scale-[1.02]">
      {/* 영화 포스터 */}
      <div className="aspect-[2/3] h-full overflow-hidden rounded-xl">
        <MoviePoster
          posterPath={content.moviePosterPath}
          title={content.movieTitle}
        />
      </div>
      {/* 리뷰 컨텐츠 */}
      <section
        onClick={reviewTitleClick}
        className="flex h-full flex-1 cursor-pointer flex-col overflow-hidden rounded-xl border bg-white px-3 py-2 hover:bg-gray-100 sm:px-4"
      >
        {isNavigating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black bg-opacity-50">
            <ImSpinner2 className="animate-spin text-4xl text-white" />
          </div>
        )}
        {/* 프로필 이미지, 닉네임 */}
        <div className="mb-2 flex items-center">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <ProfileAvatar
              s3photoKey={user?.photoKey || undefined}
              userDisplayName={user?.displayName || "사용자"}
              size={24}
              isPublic
            />
            <p className="min-w-0 truncate text-xs">
              {user?.displayName || "Guest"}
            </p>
          </div>
          <ActivityBadge activityLevel={user?.activityLevel} size="tiny" />
        </div>
        {/* 별점 & 리뷰 제목 */}
        <div className="flex items-center gap-2 border-b-4 border-dotted pb-2">
          <div className="flex items-center">
            <FaStar className="text-accent-300" size={16} />
            <span className="ml-1 text-sm font-bold">{content.rating}</span>
          </div>
          <p className="w-full truncate font-semibold">{content.reviewTitle}</p>
        </div>
        {/* 영화 타이틀 & 좋아요 */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex-1 truncate pr-1 text-xs text-gray-500 hover:underline">
            <Link
              href={`/movie-details/${content.movieId}`}
              onClick={(e) => e.stopPropagation()}
            >
              {`${content.movieTitle}(${content.originalTitle})`}
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <FaHeart className="text-red-500" size={12} />
            <div className="ml-1 text-xs">{content.likeCount}</div>
          </div>
        </div>
      </section>
    </article>
  );
}
