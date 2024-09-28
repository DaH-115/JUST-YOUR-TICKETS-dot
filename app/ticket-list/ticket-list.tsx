import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { Review } from "app/ticket-list/page";
import ReviewDetailsModal from "app/ui/reviewDetailsModal";

export default function TicketList({ reviews }: { reviews: Review[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review>();

  const openModalHandler = (content: Review) => {
    setSelectedReview(content);
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ReviewDetailsModal
        selectedReview={selectedReview}
        isModalOpen={isModalOpen}
        closeModalHandler={closeModalHandler}
      />

      {reviews.length > 0 &&
        reviews.map((post, index) => (
          <div key={post.id} className="relative h-[600px]">
            {/* CARD HEADER */}
            <div className="absolute left-0 top-0 flex w-full items-center justify-between p-2">
              <p className="rounded-full border-2 border-black bg-white px-4 py-2 font-bold">
                {index + 1}
              </p>
            </div>

            <div id="movie-poster" className="h-4/5">
              <Image
                src={`https://image.tmdb.org/t/p/original${post.posterImage}`}
                alt={post.movieTitle}
                width={1280}
                height={720}
                className="h-full w-full object-cover"
              />
            </div>
            <div
              id="info-card"
              className="absolute bottom-0 left-0 w-full border-2 border-black bg-white"
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
                  className="flex w-full items-center justify-end p-2"
                  onClick={() => openModalHandler(post)}
                >
                  <div className="flex">
                    <p className="mr-2 font-bold">
                      {post.userName ? post.userName : "Guest"}
                    </p>
                    님의 리뷰
                  </div>
                  <FaArrowRight className="ml-2" size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      <div className="flex h-[600px] items-center justify-center rounded-xl border-2 border-dotted border-gray-300 p-4">
        <Link href="/search">
          <button className="text-xl font-bold">리뷰 작성하기</button>
        </Link>
      </div>
    </>
  );
}
