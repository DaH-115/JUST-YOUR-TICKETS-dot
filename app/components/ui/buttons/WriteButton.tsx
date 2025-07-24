import Link from "next/link";
import { FaPen } from "react-icons/fa";

interface WriteButtonProps {
  movieId: number;
  size?: "large" | "small";
}

export default function WriteButton({
  movieId,
  size = "large",
}: WriteButtonProps) {
  const textSize = size === "large" ? "text-sm" : "text-xs";

  return (
    <Link
      href={`/write-review/new?movieId=${movieId}`}
      className={`${
        textSize
      } group relative flex w-full items-center justify-between overflow-hidden rounded-full p-3 text-white transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-accent-400 hover:ring-offset-1 focus:outline-none`}
    >
      {/* 기본 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 transition-opacity duration-300 group-hover:opacity-0" />
      {/* hover 시 보일 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* 버튼 내용 */}
      <span className="relative z-10 flex w-full items-center justify-between">
        <FaPen
          className={`${
            textSize
          } mx-2 transition-transform duration-300 group-hover:scale-110`}
          aria-hidden
        />
        <p className="mx-2">리뷰 작성</p>
      </span>
    </Link>
  );
}
