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
          : "rounded-xl px-3 py-2 text-xs"
      } group relative flex w-full items-center justify-between overflow-hidden bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 text-white transition-all duration-300 hover:from-primary-500 hover:via-primary-700 hover:to-primary-900 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-accent-300 focus:ring-offset-1`}
    >
      <FaPen
        className={`${
          size === "large" ? "text-sm" : "text-xs"
        } transition-transform duration-300 group-hover:scale-110`}
        aria-hidden
      />
      <p className="mx-2">리뷰 작성</p>
      <FaArrowRight
        className={`${
          size === "large" ? "text-sm" : "text-xs"
        } transition-transform duration-300 group-hover:translate-x-1`}
        aria-hidden
      />
    </Link>
  );
}
