import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { Review } from "app/ticket-list/page";
import ReviewDetailsModal from "app/ui/review-details-modal";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "firebase-config";
import { IoIosAddCircle } from "react-icons/io";

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
      />

      <div className="flex h-[600px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
        <Link href="/search">
          <button className="p-12 text-xl font-bold text-gray-300 transition-colors duration-300 hover:text-gray-800">
            <IoIosAddCircle size={48} />
          </button>
        </Link>
      </div>
      {reviews.length > 0 &&
        reviews.map((post, index) => (
          <div key={post.id} className="group/card relative h-[600px]">
            {/* CARD HEADER */}
            <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-2">
              <p className="rounded-full border-2 border-black bg-white px-4 py-2 font-bold">
                {index + 1}
              </p>
              <div className="flex items-center">
                <Link href={`/write-review/${post.id}?movieId=${post.movieId}`}>
                  <button className="rounded-full border-2 border-black bg-white px-4 py-2 font-bold transition-colors duration-300 hover:bg-black hover:text-white active:bg-black active:text-white">
                    수정
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="rounded-full border-2 border-black bg-white px-4 py-2 font-bold transition-colors duration-300 hover:bg-black hover:text-white active:bg-black active:text-white"
                >
                  삭제
                </button>
              </div>
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

            <div
              id="info-card"
              className="absolute bottom-0 right-0 w-full rounded-xl border-2 border-black bg-white drop-shadow-md transition-all duration-300 group-hover/card:bottom-2 group-hover/card:right-2"
            >
              <div className="flex items-center border-b-2 border-black">
                <div className="flex items-center justify-center px-2">
                  <IoStar className="mt-2" size={18} />
                  <p className="text-4xl font-bold">{post.rating}</p>
                </div>
                <div className="border-l-2 border-black p-2">
                  <p className="text-sm">{post.date}</p>
                  <p className="text-sm font-bold">{post.reviewTitle}</p>
                  <div className="flex text-xs text-gray-500">
                    <p>
                      {post.movieTitle} - {post.releaseYear}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-2">
                <p className="text-xs font-bold">리뷰 내용</p>
                <p id="review-post" className="truncate">
                  {post.review}
                </p>
              </div>
              <div className="border-t-2 border-black">
                <button
                  className="group relative flex w-full items-center justify-end p-2"
                  onClick={() => openModalHandler(post)}
                >
                  <div className="flex">
                    <p className="mr-2 font-bold">
                      {post.userName ? post.userName : "Guest"}
                    </p>
                    님의 리뷰
                  </div>
                  <FaArrowRight
                    className="mx-1 transition-transform duration-300 group-hover:translate-x-1"
                    size={12}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
