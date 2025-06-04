import MoviePoster from "app/components/MoviePoster";
import ProfileImage from "app/components/reviewTicket/ProfileImage";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import Link from "next/link";
import { FaStar, FaHeart } from "react-icons/fa";

interface ReviewCardProps {
  review: ReviewDoc;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { review: content, user } = review;

  return (
    <Link
      href={`/movie-details/${content.movieId}`}
      className="group flex items-stretch" // ← 여기 items-stretch 추가
    >
      {/* Movie Poster */}
      <div className="aspect-[2/3] h-full overflow-hidden rounded-xl">
        <MoviePoster
          posterPath={content.moviePosterPath}
          title={content.movieTitle}
          size={342}
        />
      </div>

      {/* Review Content */}
      <div className="relative flex h-full flex-1 flex-col overflow-hidden rounded-xl border-2 bg-white px-4 py-2">
        {/* 상단 제목/좋아요 */}
        <div className="flex items-center justify-between border-b-4 border-dotted pb-2">
          <div className="flex flex-col">
            <h3 className="line-clamp-1 text-base font-bold">
              {content.movieTitle}
            </h3>
            <p className="text-xs text-gray-500 md:text-sm">
              {content.originalTitle} ({content.releaseYear})
            </p>
          </div>
          <p className="flex items-center border-l-4 border-dotted pl-4 text-sm">
            <FaHeart className="mr-1 text-red-500" />
            <span className="min-w-[1rem] text-center">
              {content.likeCount}
            </span>
          </p>
        </div>

        {/* 중간 별점 & 리뷰 제목 */}
        <div className="flex items-center border-b-4 border-dotted py-1">
          <div className="mr-4 flex items-center gap-1 border-r-4 border-dotted pr-4">
            <FaStar className="text-yellow-400" />
            <span className="text-lg font-bold">{content.rating}</span>
          </div>
          <p className="line-clamp-1">{content.reviewTitle}</p>
        </div>

        {/* 하단 프로필 & 날짜 */}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs font-bold">
          <div className="flex items-center">
            <ProfileImage
              photoURL={user.photoURL || undefined}
              userDisplayName={user.displayName || "사용자"}
            />
            <div className="line-clamp-1 max-w-[60%]">{user.displayName}</div>
          </div>
          <span className="text-xs font-medium text-gray-500">
            {content.createdAt}
          </span>
        </div>
      </div>
    </Link>
  );
}
