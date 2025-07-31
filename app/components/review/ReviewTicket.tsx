"use client";

import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import ActivityBadge from "app/components/ui/feedback/ActivityBadge";
import MoviePoster from "app/components/movie/MoviePoster";
import ProfileAvatar from "app/components/user/ProfileAvatar";
import Link from "next/link";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

interface ReviewTicketProps {
  review: ReviewDoc;
}

export default function ReviewTicket({ review }: ReviewTicketProps) {
  return (
    <article className="group relative flex cursor-pointer flex-col items-stretch drop-shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-2">
      {/* 포스터 이미지 */}
      <div className="aspect-[2/3] w-full overflow-hidden rounded-xl">
        <MoviePoster
          posterPath={review.review.moviePosterPath}
          title={review.review.movieTitle}
        />
      </div>
      {/* 정보 카드 */}
      <section className="relative z-10 mt-[-3rem] flex flex-col rounded-b-xl border bg-white p-2 text-black transition-colors duration-200 group-hover:bg-gray-200">
        {/* 프로필 사진 & 닉네임 & 등급 */}
        <div className="flex items-center">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <ProfileAvatar
              s3photoKey={review.user.photoKey || undefined}
              userDisplayName={review.user.displayName || "사용자"}
              size={24}
              isPublic
            />
            <p className="min-w-0 truncate text-sm">
              {review.user.displayName || "사용자"}
            </p>
          </div>
          <ActivityBadge
            activityLevel={review.user.activityLevel}
            size="tiny"
          />
        </div>
        {/* 리뷰 제목 */}
        <div className="mt-2 flex items-center">
          <div className="mr-1.5 flex items-center">
            <FaStar className="text-accent-300" size={16} />
            <span className="ml-1 text-sm font-bold">
              {review.review.rating}
            </span>
          </div>
          <span className="w-full truncate font-semibold">
            {review.review.reviewTitle}
          </span>
        </div>
        {/* 영화 타이틀 & 좋아요 */}
        <div className="mt-2 flex items-center justify-between border-t-4 border-dotted pt-1.5">
          <div className="flex-1 truncate pr-1.5 text-sm text-gray-500 hover:underline">
            <Link href={`/movie-details/${review.review.movieId}`}>
              {`${review.review.movieTitle} (${review.review.releaseYear})`}
            </Link>
          </div>
          {/* 좋아요 버튼 */}
          <div className="flex items-center">
            <span className="text-red-500 transition-transform duration-200 group-hover:scale-110">
              {review.review.isLiked ? <FaHeart /> : <FaRegHeart />}
            </span>
            <span className="ml-1 text-center">{review.review.likeCount}</span>
          </div>
        </div>
      </section>
    </article>
  );
}
