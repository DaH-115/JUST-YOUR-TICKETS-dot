import { useCallback, useState } from "react";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { UserReview } from "api/movie-reviews/fetchUserReviews";
import { IoIosAddCircle } from "react-icons/io";
import ReviewDetailsModal from "app/components/reviewTicketList/review-details-modal";
import TicketBtnGroup from "app/ticket-list/ticket-btn-group";
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
    <div className="grid grid-cols-3 gap-2 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {selectedReview && (
        <ReviewDetailsModal
          selectedReview={selectedReview}
          isModalOpen={isModalOpen}
          closeModalHandler={closeModalHandler}
          onReviewDeleted={onReviewDeleteHanlder}
        />
      )}

      {/* 리뷰 티켓 추가 버튼 */}
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-500 md:flex">
        <Link href="/search">
          <button className="p-12 text-4xl font-bold text-gray-500 transition-colors duration-300 hover:text-gray-700 md:text-6xl">
            <IoIosAddCircle />
          </button>
        </Link>
      </div>
      {reviews.length > 0 && (
        <>
          {reviews.map((post) => (
            <div
              key={post.id}
              className="group/card relative mb-20 drop-shadow-md md:mb-32"
            >
              {/* CARD HEADER */}
              <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-end p-1 md:p-2">
                <TicketBtnGroup
                  postId={post.id}
                  movieId={post.movieId}
                  onReviewDeleted={onReviewDeleteHanlder}
                />
              </div>

              {/* MOVIE POSTER */}
              <MoviePoster
                posterPath={post.posterImage}
                title={post.movieTitle}
                size={342}
                lazy
              />

              {/* MOVIE INFO CARD */}
              <div className="absolute -bottom-20 right-0 w-full rounded-lg border-2 border-black bg-white p-1 transition-all duration-500 md:-bottom-32 md:rounded-xl md:p-2 lg:group-hover/card:-bottom-28 lg:group-hover/card:right-2">
                {/* RATE & NAME */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center justify-center text-xs md:px-2 md:text-base">
                    <IoStar className="mr-1 text-accent-300" />
                    <p className="font-bold">{post.rating}</p>
                  </div>
                  <p className="truncate px-2 text-xs font-bold lg:text-sm">
                    {post.userName ? post.userName : "Guest"}
                  </p>
                </div>
                {/* POST NUMBER & REVIEW TITLE */}
                <div className="mb-2 max-h-10 w-full overflow-y-scroll border-y-2 border-dotted border-gray-200 p-1 scrollbar-hide md:border-y-4 md:px-0 md:py-2">
                  <p className="text-xs md:text-sm">
                    {`${post.number}.`}
                    <span className="ml-1 font-bold">{post.reviewTitle}</span>
                  </p>
                  {/* 영화 상세 정보로 이동 */}
                  <div className="hidden text-xs text-gray-500 md:block">
                    <Link
                      href={`/movie-details/${post.movieId}`}
                      className="border-gray-500 transition-all hover:border-b"
                    >
                      {post.movieTitle}
                    </Link>
                    {`(${post.releaseYear})`}
                  </div>
                </div>
                {/* REVIEW CONTENT MODAL BUTTON */}
                <div className="rounded-md bg-primary-600 p-1 hover:bg-primary-700 md:rounded-lg md:px-3 md:py-2">
                  <button
                    className="group relative flex w-full items-center justify-end"
                    onClick={() => openModalHandler(post)}
                  >
                    <div className="flex items-center justify-center">
                      <p className="hidden text-xs text-white md:mr-1 md:block">
                        내용 보기
                      </p>
                      <FaExternalLinkAlt className="text-xs text-gray-200" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
