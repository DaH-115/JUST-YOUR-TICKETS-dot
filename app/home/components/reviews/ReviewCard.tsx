import Link from "next/link";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { useCallback, useState } from "react";
import ActivityBadge from "app/components/ActivityBadge";
import MoviePoster from "app/components/MoviePoster";
import ProfileImage from "app/components/ProfileImage";
import { ReviewWithLike } from "lib/reviews/fetchReviewsPaginated";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken";
import { useAlert } from "store/context/alertContext";

interface ReviewCardProps {
  review: ReviewWithLike;
  onReviewClick: (reviewId: string) => void;
  showLikeButton?: boolean;
  isNavigating?: boolean;
}

export default function ReviewCard({
  review: initialReview,
  onReviewClick,
  showLikeButton = true,
  isNavigating = false,
}: ReviewCardProps) {
  const [review, setReview] = useState(initialReview);
  const { user, review: content, isLiked } = review;
  const userState = useAppSelector(selectUser);
  const { showErrorHandler } = useAlert();
  const [isLiking, setIsLiking] = useState(false);

  const handleReviewTitleClick = () => {
    onReviewClick(review.id);
  };

  const handleLikeClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!userState?.uid) {
        showErrorHandler("오류", "로그인이 필요합니다.");
        return;
      }
      setIsLiking(true);

      const newLikedStatus = !isLiked;
      const originalLikeCount = content.likeCount;
      const newLikeCount = newLikedStatus
        ? originalLikeCount + 1
        : originalLikeCount - 1;

      // Optimistic UI update
      setReview((prev) => ({
        ...prev,
        isLiked: newLikedStatus,
        review: { ...prev.review, likeCount: newLikeCount },
      }));

      try {
        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch(`/api/reviews/${review.id}/like`, {
            method: newLikedStatus ? "POST" : "DELETE",
            headers: { "Content-Type": "application/json", ...authHeaders },
            body: newLikedStatus
              ? JSON.stringify({ movieTitle: content.movieTitle })
              : undefined,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
          }
        });
      } catch (error: unknown) {
        // Revert on error
        setReview((prev) => ({
          ...prev,
          isLiked: !newLikedStatus,
          review: { ...prev.review, likeCount: originalLikeCount },
        }));
        if (error instanceof Error) {
          showErrorHandler("오류", error.message);
        } else {
          showErrorHandler("오류", "좋아요 처리에 실패했습니다.");
        }
      } finally {
        setIsLiking(false);
      }
    },
    [
      review.id,
      userState?.uid,
      showErrorHandler,
      isLiked,
      content.likeCount,
      content.movieTitle,
    ],
  );

  return (
    <div className="group relative flex transform-gpu items-stretch transition-transform duration-300 hover:scale-[1.02]">
      {/* 영화 포스터 */}
      <div className="aspect-[2/3] h-full overflow-hidden rounded-xl">
        <MoviePoster
          posterPath={content.moviePosterPath}
          title={content.movieTitle}
        />
      </div>

      {/* 리뷰 컨텐츠 */}
      <div
        onClick={handleReviewTitleClick}
        className="relative flex h-full flex-1 cursor-pointer flex-col overflow-hidden rounded-xl border bg-white px-3 py-2 sm:px-4"
      >
        {isNavigating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black bg-opacity-50">
            <ImSpinner2 className="animate-spin text-4xl text-white" />
          </div>
        )}
        {/* 상단 제목 & 좋아요 */}
        <div className="flex items-center justify-between border-b-4 border-dotted pb-2">
          <div className="flex flex-col text-xs">
            <Link
              href={`/movie-details/${content.movieId}`}
              className="transition-colors hover:text-accent-300"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="line-clamp-1 font-bold">{content.movieTitle}</h3>
              <p className="line-clamp-1 text-gray-600">
                {content.originalTitle} ({content.releaseYear})
              </p>
            </Link>
          </div>
          {showLikeButton ? (
            <button
              className="flex items-center text-sm"
              onClick={handleLikeClick}
              disabled={!userState?.uid || isLiking}
            >
              <div className="text-red-500 transition-transform duration-200 group-hover:scale-110">
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </div>
              <div className="ml-1.5 flex min-w-[1.5rem] items-center justify-center">
                {isLiking ? (
                  <ImSpinner2 className="animate-spin" />
                ) : (
                  <span className="min-w-[1rem] text-center">
                    {content.likeCount}
                  </span>
                )}
              </div>
            </button>
          ) : (
            <div className="flex items-center text-sm">
              <div className="text-red-500">
                <FaHeart />
              </div>
              <div className="ml-1.5 flex min-w-[1.5rem] items-center justify-center">
                <span className="min-w-[1rem] text-center">
                  {content.likeCount}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 중간 별점 & 리뷰 제목 */}
        <div className="flex items-center border-b-4 border-dotted py-1">
          <div className="mr-4 flex items-center gap-1 border-r-4 border-dotted pr-4">
            <FaStar className="text-yellow-400" />
            <span className="font-bold">{content.rating}</span>
          </div>
          <div className="line-clamp-1 flex-1 text-left text-sm">
            {content.reviewTitle}
          </div>
        </div>

        {/* 하단 프로필 & 등급 & 날짜 */}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs font-bold">
          <div className="flex items-center gap-2">
            <ProfileImage
              photoKey={user.photoKey || undefined}
              userDisplayName={user.displayName || "사용자"}
            />
            <div className="line-clamp-1 max-w-[60%]">{user.displayName}</div>
            <ActivityBadge activityLevel={user.activityLevel} size="tiny" />
          </div>
        </div>
      </div>
    </div>
  );
}
