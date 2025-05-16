import MoviePoster from "app/components/MoviePoster";
import { Review } from "lib/reviews/fetchReviews";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link href={`/movie-details/${review.movieId}`} className="group flex">
      <div className="w-[25%] overflow-hidden rounded-md">
        <MoviePoster
          posterPath={review.moviePosterPath}
          title={review.movieTitle}
          size={342}
        />
      </div>
      <div className="relative flex h-full w-full flex-1 overflow-hidden rounded-lg border-2 bg-white p-4">
        <div className="flex h-full w-full text-black">
          <div className="flex h-full flex-1 flex-col">
            <div className="flex items-center justify-between border-b-4 border-dotted pb-2">
              <h3 className="line-clamp-1 text-base font-bold">
                {review.movieTitle}({review.releaseYear})
              </h3>
              <p className="flex items-center border-l-4 border-dotted pl-4 text-sm">
                <FaHeart className="mr-1 text-red-500" />
                <span className="min-w-4 text-center">{review.likeCount}</span>
              </p>
            </div>
            <div className="flex items-center border-b-4 border-dotted py-1">
              <div className="mr-4 flex items-center gap-1 border-r-4 border-dotted pr-4">
                <FaStar className="text-yellow-400" />
                <span className="text-lg font-bold">{review.rating}</span>
              </div>
              <p className="line-clamp-1 text-lg">{review.reviewTitle}</p>
            </div>
            <div className="mt-auto flex items-center justify-between pt-2 text-xs font-bold">
              <span className="line-clamp-1 max-w-[60%]">
                {review.userName}
              </span>
              <span className="text-xs font-medium">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
