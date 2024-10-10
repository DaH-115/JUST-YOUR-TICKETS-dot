import { Review } from "app/ticket-list/page";
import Link from "next/link";
import { IoCloseOutline, IoStar } from "react-icons/io5";

type ReviewDetailsModalProps = {
  closeModalHandler: () => void;
  handleDeleteHandler: (id: string) => void;
  isModalOpen: boolean;
  selectedReview?: Review;
};

export default function ReviewDetailsModal({
  closeModalHandler,
  handleDeleteHandler,
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
        id="info-card"
        className={`absolute w-2/5 rounded-2xl border-2 border-black bg-white transition-all duration-300 ${
          isModalOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-10 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between pr-2">
          <div className="flex items-center justify-center p-4">
            <IoStar className="mt-2" size={18} />
            <p className="text-4xl font-bold">{selectedReview?.rating}</p>
          </div>
          <div className="w-full border-l-2 border-black p-2">
            <p className="text-xs">{selectedReview?.date}</p>
            <p className="font-bold">{selectedReview?.reviewTitle}</p>
            <div className="flex text-sm text-gray-500">
              <p>
                {selectedReview?.movieTitle} - {selectedReview?.releaseYear}
              </p>
            </div>
          </div>
          <div
            id="btn-group"
            className="flex items-center justify-center whitespace-nowrap text-sm"
          >
            <Link
              href={`/write-review/${selectedReview?.id}?movieId=${selectedReview?.movieId}`}
            >
              <button className="rounded-full border-2 border-black bg-white px-4 py-2 font-bold transition-colors duration-300 hover:bg-black hover:text-white active:bg-black active:text-white">
                수정
              </button>
            </Link>
            <button
              onClick={() => handleDeleteHandler(selectedReview?.id || "")}
              className="rounded-full border-2 border-black bg-white px-4 py-2 font-bold transition-colors duration-300 hover:bg-black hover:text-white active:bg-black active:text-white"
            >
              삭제
            </button>
          </div>
        </div>
        <div className="h-96 flex-1 overflow-y-scroll border-y-2 border-black px-4 pb-6">
          <p className="pt-4 text-xs font-bold">리뷰 내용</p>
          <p className="break-keep">{selectedReview?.review}</p>
        </div>
        <div className="flex justify-end px-4 py-2">
          <p className="mr-2 font-bold">
            {selectedReview?.userName ? selectedReview?.userName : "Guest"}
          </p>
          님의 리뷰
        </div>
        <div
          onClick={closeModalHandler}
          className="flex cursor-pointer justify-end rounded-b-xl bg-black p-4 font-bold text-white"
        >
          <IoCloseOutline size={26} />
        </div>
      </div>
    </div>
  );
}
