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
          ? "rounded-2xl p-4 text-sm md:text-base"
          : "rounded-lg px-3 py-2 text-xs md:text-sm"
      } group relative flex w-full items-center justify-between overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white transition-all duration-300 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg focus:outline-none`}
    >
      <FaPen
        className={`${
          size === "large" ? "text-sm md:text-base" : "text-xs md:text-sm"
        } mr-2 transition-transform duration-300 group-hover:scale-110`}
        aria-hidden
      />
      <p className="font-medium">리뷰 작성</p>

      <FaArrowRight
        className={`${
          size === "large" ? "text-sm md:text-base" : "text-xs md:text-sm"
        } transition-transform duration-300 group-hover:translate-x-1`}
        aria-hidden
      />
    </Link>
  );
}
