import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface NewWriteBtnProps {
  movieId: number;
  size?: "large" | "small";
}

export default function NewWriteBtn({
  movieId,
  size = "large",
}: NewWriteBtnProps) {
  return (
    <Link
      href={`/write-review/new?movieId=${movieId}`}
      className={`${size === "large" ? "rounded-xl p-4 text-sm" : "rounded-lg p-2 text-xs"} flex w-full items-center justify-center bg-primary-600 text-white transition-colors duration-300 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-300 md:justify-end`}
    >
      리뷰 작성
      <FaArrowRight
        className={`${size === "large" ? "text-lg" : "text-xs"} ml-1 hidden md:block`}
        aria-hidden
      />
    </Link>
  );
}
