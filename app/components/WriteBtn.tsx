import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface WriteBtnProps {
  movieId: number;
  size?: "large" | "small";
}

export default function WriteBtn({ movieId, size = "large" }: WriteBtnProps) {
  return (
    <Link
      href={`/write-review/new?movieId=${movieId}`}
      className={`${size === "large" ? "p-4 text-lg md:text-sm" : "px-3 py-2 text-xs md:p-3 md:text-sm"} flex w-full items-center justify-between rounded-b-xl bg-primary-600 text-white transition-colors duration-300 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-300`}
    >
      리뷰 작성
      <FaArrowRight
        className={`${size === "large" ? "text-lg md:text-sm" : "text-xs"} ml-2`}
        aria-hidden
      />
    </Link>
  );
}
