import Link from "next/link";

interface ReviewBtnGroupProps {
  postId: string;
  movieId: string;
  onReviewDeleted: (postId: string) => void;
}

export default function ReviewBtnGroup({
  postId,
  movieId,
  onReviewDeleted,
}: ReviewBtnGroupProps) {
  return (
    <div className="hidden items-center space-x-1 text-xs md:flex">
      <button
        onClick={() => onReviewDeleted(postId)}
        className="rounded-full border-2 border-black bg-white px-2 py-1 transition-colors duration-300 hover:bg-gray-200 active:bg-black active:text-white"
      >
        삭제
      </button>
      <Link href={`/write-review/${postId}?movieId=${movieId}`}>
        <button className="rounded-full border-2 border-black bg-white px-2 py-1 transition-colors duration-300 hover:bg-gray-200 active:bg-black active:text-white">
          수정
        </button>
      </Link>
    </div>
  );
}
