import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "firebase-config";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { Review } from "app/ticket-list/page";
import { IoIosAddCircle } from "react-icons/io";
import ReviewDetailsModal from "app/ui/review-details-modal";
import ReviewBtnGroup from "app/ticket-list/review-btn-group";
import ReviewListSkeleton from "app/ticket-list/review-list-skeleton";

export default function TicketList({
  reviews,
  onReviewDeleted,
}: {
  reviews: Review[];
  onReviewDeleted: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review>();

  const openModalHandler = (content: Review) => {
    setSelectedReview(content);
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "movie-reviews", id));
        onReviewDeleted();
        closeModalHandler();
      } catch (error) {
        console.error("리뷰 삭제 중 오류 발생:", error);
        alert("리뷰 삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <>
      <ReviewDetailsModal
        selectedReview={selectedReview}
        isModalOpen={isModalOpen}
        closeModalHandler={closeModalHandler}
        handleDeleteHandler={handleDelete}
      />

      <>
        {reviews.length > 0 ? (
          <>
            <div className="hidden h-[450px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 md:flex">
              <Link href="/search">
                <button className="p-12 text-xl font-bold text-gray-300 transition-colors duration-300 hover:text-gray-800">
                  <IoIosAddCircle size={48} />
                </button>
              </Link>
            </div>
            {reviews.map((post, index) => (
              <div
                key={post.id}
                className="group/card relative h-[300px] drop-shadow-md md:h-[450px]"
              >
                {/* CARD HEADER */}
                <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-2">
                  <p className="flex items-center justify-center rounded-full border-2 border-black bg-white px-2 py-1 text-xs font-bold md:text-base">
                    {index + 1}
                  </p>
                  {/* DESKTOP ONLY */}
                  <ReviewBtnGroup
                    postId={post.id}
                    movieId={post.movieId}
                    onReviewDeleted={onReviewDeleted}
                  />
                </div>

                <div id="movie-poster" className="h-4/5">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${post.posterImage}`}
                    alt={post.movieTitle}
                    width={1280}
                    height={720}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-full rounded-xl border-2 border-black bg-white transition-all duration-300 group-hover/card:bottom-1 group-hover/card:right-1 md:group-hover/card:bottom-2 md:group-hover/card:right-2">
                  <div className="flex items-center justify-between border-b">
                    <div className="flex items-center justify-center px-2 py-1">
                      <IoStar className="mr-1 text-sm" />
                      <p className="text-sm font-bold lg:text-2xl">
                        {post.rating}
                      </p>
                    </div>
                    <p className="px-3 py-1 text-xs font-bold lg:text-sm">
                      {post.userName ? post.userName : "Guest"}
                    </p>
                  </div>
                  <div className="h-[4rem] overflow-y-scroll break-keep p-2 md:border-b">
                    <p className="text-sm font-bold">{post.reviewTitle}</p>
                    <div className="flex text-xs text-gray-500">
                      {post.movieTitle} - {post.releaseYear}
                    </div>
                  </div>
                  <div className="flex items-center border-t px-3 py-2">
                    <p className="w-full text-xs">{post.date}</p>
                    <button
                      className="group relative flex items-center justify-end"
                      onClick={() => openModalHandler(post)}
                    >
                      <FaExternalLinkAlt className="text-gray-400" size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <ReviewListSkeleton />
        )}
      </>
    </>
  );
}
