import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "firebase-config";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { MovieReview } from "api/movie-reviews/fetchMovieReviews";
import { IoIosAddCircle } from "react-icons/io";
import ReviewDetailsModal from "app/ui/reviewTicketList/review-details-modal";
import ReviewBtnGroup from "app/ticket-list/review-btn-group";
import MoviePoster from "../movie-poster";

export default function ReviewTicket({
  reviews,
  onReviewUpdated,
}: {
  reviews: MovieReview[];
  onReviewUpdated: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<MovieReview>();

  const openModalHandler = useCallback((content: MovieReview) => {
    setSelectedReview(content);
    setIsModalOpen(true);
  }, []);

  const closeModalHandler = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onReviewDeleteHanlder = useCallback(async (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "movie-reviews", id));
        onReviewUpdated();
        closeModalHandler();
      } catch (error) {
        alert("리뷰 삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 pb-8 md:grid-cols-3 lg:grid-cols-4">
      {selectedReview && (
        <ReviewDetailsModal
          selectedReview={selectedReview}
          isModalOpen={isModalOpen}
          closeModalHandler={closeModalHandler}
          onReviewDeleted={onReviewDeleteHanlder}
        />
      )}

      <div className="hidden h-[450px] items-center justify-center rounded-xl border-2 border-dashed border-gray-500 md:flex">
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
              className="group/card relative h-[450px] drop-shadow-md"
            >
              {/* CARD HEADER */}
              <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-end p-2">
                <ReviewBtnGroup
                  postId={post.id}
                  movieId={post.movieId}
                  onReviewDeleted={onReviewDeleteHanlder}
                />
              </div>
              <div id="movie-poster" className="aspect-[2/3] h-full w-full">
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${post.posterImage}`}
                  alt={post.movieTitle}
                  width={500}
                  height={750}
                  className="h-full w-full rounded-xl object-cover"
                  priority
                  quality={50}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 500px"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-full rounded-xl border-2 border-black bg-white p-2 transition-all duration-300 group-hover/card:bottom-1 group-hover/card:right-1 md:group-hover/card:bottom-2 md:group-hover/card:right-2">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center justify-center px-2">
                    <IoStar className="mr-1 text-[#D4AF37]" />
                    <p className="font-bold lg:text-2xl">{post.rating}</p>
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
                <div className="rounded-lg bg-[#701832] px-3 py-2 hover:bg-[#551226]">
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
