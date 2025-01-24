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
    <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
          <button className="p-12 text-xl font-bold text-gray-500 transition-colors duration-300 hover:text-gray-700">
            <IoIosAddCircle size={48} />
          </button>
        </Link>
      </div>
      {reviews.length > 0 && (
        <>
          {reviews.map((post) => (
            <div
              key={post.id}
              className="group/card relative mb-32 drop-shadow-md"
            >
              {/* CARD HEADER */}
              <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-end p-2">
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
              <div className="absolute -bottom-32 right-0 w-full rounded-xl border-2 border-black bg-white p-2 transition-all duration-500 lg:group-hover/card:-bottom-28 lg:group-hover/card:right-2">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center justify-center px-2">
                    <IoStar className="mr-1 text-accent-300" />
                    <p className="font-bold">{post.rating}</p>
                  </div>
                  <p className="px-2 text-xs font-bold lg:text-sm">
                    {post.userName ? post.userName : "Guest"}
                  </p>
                </div>
                <div className="mb-2 h-[4rem] overflow-y-scroll break-keep border-y-4 border-dotted border-gray-200 py-2 scrollbar-hide">
                  <p className="text-sm font-bold">
                    {post.number}. {post.reviewTitle}
                  </p>
                  {/* 영화 상세 정보로 이동 */}
                  <div className="text-xs text-gray-500">
                    <Link
                      href={`/movie-details/${post.movieId}`}
                      className="border-gray-500 transition-all hover:border-b"
                    >
                      {post.movieTitle}
                    </Link>
                    - {post.releaseYear}
                  </div>
                </div>
                <div className="rounded-lg bg-primary-600 px-3 py-2 hover:bg-primary-700">
                  <button
                    className="group relative flex w-full items-center justify-end"
                    onClick={() => openModalHandler(post)}
                  >
                    <div className="flex items-center justify-center">
                      <p className="mr-1 text-xs text-white">내용 보기</p>
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
