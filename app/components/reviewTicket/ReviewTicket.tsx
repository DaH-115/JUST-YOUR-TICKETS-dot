"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { IoStar } from "react-icons/io5";
import { Review } from "lib/reviews/fetchReviews";
import ReviewDetailsModal from "app/components/reviewTicket/ReviewDetailsModal";
import { deleteReview } from "app/actions/deleteReview";
import MoviePoster from "app/components/MoviePoster";
import { useAlert } from "store/context/alertContext";
import { firebaseErrorHandler } from "app/utils/firebaseError";

export default function ReviewTicket({ reviews }: { reviews: Review[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review>();
  const { showErrorHanlder } = useAlert();

  const openModalHandler = useCallback((content: Review) => {
    setSelectedReview(content);
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
          showErrorHanlder("오류", error.message);
        } else {
          const { title, message } = firebaseErrorHandler(error);
          showErrorHanlder(title, message);
        }
      }
    },
    [closeModalHandler],
  );

  return (
    <>
      {selectedReview && (
        <ReviewDetailsModal
          selectedReview={selectedReview}
          isModalOpen={isModalOpen}
          closeModalHandler={closeModalHandler}
          onReviewDeleted={onReviewDeleteHanlder}
        />
      )}
      <div className="grid grid-cols-3 gap-2 lg:grid-cols-5">
        {reviews.map((post) => (
          <div
            key={post.id}
            onClick={() => openModalHandler(post)}
            className="relative mb-16 cursor-pointer drop-shadow-md transition-transform duration-300 hover:-translate-y-1"
          >
            {/* MOVIE POSTER */}
            <MoviePoster
              posterPath={post.moviePosterPath}
              title={post.movieTitle}
              size={342}
            />
            {/* MOVIE INFO CARD */}
            <div className="absolute -bottom-16 right-0 w-full rounded-lg border bg-white p-2 transition-all duration-500 md:-bottom-16">
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
                {/* 클릭하면 영화 상세 정보로 이동 */}
                <div
                  className="w-full text-xs text-gray-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={`/movie-details/${post.movieId}`}
                    className="block truncate text-gray-500 transition-all duration-300 hover:text-accent-400 hover:underline active:text-accent-400 active:underline"
                  >
                    {`${post.movieTitle}(${post.releaseYear})`}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
