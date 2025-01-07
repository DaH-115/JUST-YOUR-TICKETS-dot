import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface NewWriteBtnProps {
  movieId: number;
}

export default function NewWriteBtn({ movieId }: NewWriteBtnProps) {
  return (
    <Link
      href={`/write-review/new?movieId=${movieId}`}
      className={`focus:ring-accent-300 hover:bg-primary-700 bg-primary-600 flex w-full items-center justify-end rounded-xl p-4 text-sm text-white transition-colors duration-300 focus:outline-none focus:ring-2`}
    >
      리뷰 작성하기
      <FaArrowRight className={`ml-1 text-lg`} aria-hidden />
    </Link>
  );
}
