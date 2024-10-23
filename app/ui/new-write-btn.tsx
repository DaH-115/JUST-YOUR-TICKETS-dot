import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface NewWriteBtnProps {
  movieId: number;
  size?: "sm" | "md" | "lg";
}

export default function NewWriteBtn({
  movieId,
  size = "md",
}: NewWriteBtnProps) {
  const sizeStyles = {
    sm: "p-2 text-sm",
    md: "p-4 text-base",
    lg: "p-6 text-lg",
  };

  const arrowSizeStyles = {
    sm: "text-base lg:text-lg",
    md: "text-lg lg:text-xl",
    lg: "text-xl",
  };

  return (
    <Link
      href={`/write-review/new?movieId=${movieId}`}
      className={`flex w-full items-center justify-end rounded-2xl bg-black text-white ${sizeStyles[size]}`}
    >
      <p>리뷰 작성하기</p>
      <FaArrowRight className={`ml-2 ${arrowSizeStyles[size]}`} />
    </Link>
  );
}
