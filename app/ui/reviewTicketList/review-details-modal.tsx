import Link from "next/link";
import { MovieReview } from "api/movie-reviews/fetchMovieReviews";
import { IoCloseOutline, IoStar } from "react-icons/io5";

type ReviewDetailsModalProps = {
  closeModalHandler: () => void;
  onReviewDeleted: (id: string) => void;
  isModalOpen: boolean;
  selectedReview?: MovieReview;
};

export default function ReviewDetailsModal({
  closeModalHandler,
  onReviewDeleted,
  isModalOpen,
  selectedReview,
}: ReviewDetailsModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 shadow-lg transition-all duration-300 ${
        isModalOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`absolute w-11/12 rounded-2xl border-2 border-black bg-white drop-shadow-lg transition-all duration-500 lg:w-2/5 ${
          isModalOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-full opacity-0"
        }`}
      >
        <div className="flex h-[4rem] items-center justify-between pr-2">
          <div className="flex h-full items-center justify-center border-r border-black px-4 py-2">
            <IoStar className="mt-0 md:mt-2" size={18} />
            <p className="text-2xl font-bold md:text-3xl">
              {selectedReview?.rating}
            </p>
          </div>
          <div className="w-full p-2">
            <h1 className="font-bold">{selectedReview?.reviewTitle}</h1>
            <div className="flex text-xs text-gray-500">
              {selectedReview?.movieTitle} - {selectedReview?.releaseYear}
            </div>
          </div>
        </div>
        <div className="h-64 flex-1 overflow-y-scroll border-y border-black px-4 pb-8 pt-2 lg:h-96">
          <h2 className="mb-1 text-xs font-bold">리뷰 내용</h2>
          <p className="break-keep">{selectedReview?.review}</p>
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-sm">
          <p className="text-xs">{selectedReview?.date}</p>
          <div className="flex items-center">
            <span className="mr-1 font-bold">
              {selectedReview?.userName ? selectedReview?.userName : "Guest"}
            </span>
            님의 리뷰
          </div>
        </div>
        <div className="flex items-center justify-between rounded-b-xl bg-black p-2">
          <div className="flex items-center justify-center whitespace-nowrap text-xs">
            <button
              onClick={() => onReviewDeleted(selectedReview?.id || "")}
              className="rounded-full border-2 border-black bg-white px-2 py-1 transition-colors duration-300 hover:bg-gray-200 active:bg-black active:text-white"
            >
              삭제
            </button>
            <Link
              href={`/write-review/${selectedReview?.id}?movieId=${selectedReview?.movieId}`}
            >
              <button className="rounded-full border-2 border-black bg-white px-2 py-1 transition-colors duration-300 hover:bg-gray-200 active:bg-black active:text-white">
                수정
              </button>
            </Link>
          </div>
          <IoCloseOutline
            onClick={closeModalHandler}
            className="cursor-pointer text-white"
            size={26}
          />
        </div>
      </div>
    </div>
  );
}
