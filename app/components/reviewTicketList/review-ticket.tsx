import { useCallback, useState } from "react";
import Link from "next/link";
import { IoStar } from "react-icons/io5";
import { UserReview } from "api/movie-reviews/fetchUserReviews";
import ReviewDetailsModal from "app/components/reviewTicketList/review-details-modal";
import { deleteReview } from "app/actions/delete-review";
import MoviePoster from "app/components/movie-poster";

export default function ReviewTicket({ reviews }: { reviews: UserReview[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<UserReview>();

  const openModalHandler = useCallback((content: UserReview) => {
    setSelectedReview(content);
    setIsModalOpen(true);
  }, []);

  const closeModalHandler = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onReviewDeleteHanlder = useCallback((id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteReview(id);
      closeModalHandler();
    }
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2 lg:grid-cols-7">
      {selectedReview && (
        <ReviewDetailsModal
          selectedReview={selectedReview}
          isModalOpen={isModalOpen}
          closeModalHandler={closeModalHandler}
          onReviewDeleted={onReviewDeleteHanlder}
        />
      )}
      {reviews.length > 0 && (
        <>
          {reviews.map((post) => (
            <div
              key={post.id}
              onClick={() => openModalHandler(post)}
              className="relative mb-16 cursor-pointer drop-shadow-md transition-transform duration-300 hover:-translate-y-1"
            >
              {/* MOVIE POSTER */}
              <MoviePoster
                posterPath={post.posterImage}
                title={post.movieTitle}
                size={342}
                lazy
              />

              {/* MOVIE INFO CARD */}
              <div className="absolute -bottom-16 right-0 w-full rounded-lg border border-gray-200 bg-white p-2 transition-all duration-500 md:-bottom-16">
                {/* RATE & NAME */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center text-xs">
                    <IoStar className="mr-1 text-accent-300" />
                    <p className="font-bold">{post.rating}</p>
                  </div>
                  <div className="flex-1 pl-2">
                    <p className="truncate text-right text-xs font-bold">
                      {post.userName ? post.userName : "Guest"}
                    </p>
                  </div>
                </div>
                {/* POST NUMBER & REVIEW TITLE */}
                <div className="w-full">
                  <p className="block w-full truncate pt-2 text-xs">
                    {post.reviewTitle}
                  </p>
                  {/* 영화 상세 정보로 이동 */}
                  <div className="w-full text-xs text-gray-500">
                    <Link
                      href={`/movie-details/${post.movieId}`}
                      className="block truncate border-gray-500 transition-all"
                    >
                      {`${post.movieTitle}(${post.releaseYear})`}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
