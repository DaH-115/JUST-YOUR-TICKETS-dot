import Link from "next/link";
import { FaArrowRight, FaPen } from "react-icons/fa";

interface WriteBtnProps {
  movieId: number;
  size?: "large" | "small";
}

export default function WriteBtn({ movieId, size = "large" }: WriteBtnProps) {
  return (
    <Link
      href={`/write-review/new?movieId=${movieId}`}
      className={`${
        size === "large"
          ? "p-4 text-lg md:text-sm"
          : "px-3 py-2 text-xs md:p-3 md:text-sm"
      } group relative flex w-full items-center justify-between overflow-hidden rounded-b-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white transition-all duration-300 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-300`}
    >
      <FaPen
        className={`${
          size === "large" ? "text-base md:text-sm" : "text-xs"
        } mr-2 transition-transform duration-300 group-hover:scale-110`}
        aria-hidden
      />
      <span className="font-medium">리뷰 작성</span>

      <FaArrowRight
        className={`${
          size === "large" ? "text-lg md:text-sm" : "text-xs"
        } transition-transform duration-300 group-hover:translate-x-1`}
        aria-hidden
      />
    </Link>
  );
}
