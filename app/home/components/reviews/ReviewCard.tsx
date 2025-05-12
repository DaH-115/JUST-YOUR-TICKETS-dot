import { Review } from "lib/reviews/fetchReviews";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link href={`/movie-details/${review.movieId}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
        <div className="flex gap-4">
          <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={`https://image.tmdb.org/t/p/w500${review.moviePosterPath}`}
              alt={review.movieTitle}
              width={64}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <h3 className="text-lg font-bold text-white">
              {review.movieTitle}
            </h3>
            <p className="text-gray-300">{review.reviewTitle}</p>
            <div className="mt-1 flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="text-sm text-white">{review.rating}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-gray-300">
              {review.reviewContent}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>{review.userName}</span>
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
