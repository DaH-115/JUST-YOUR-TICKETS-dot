import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface NewWriteBtnProps {
  movieId: number;
}

export default function NewWriteBtn({ movieId }: NewWriteBtnProps) {
  return (
    <Link
      href={`/write-review/new?movieId=${movieId}`}
      className={`flex w-full items-center justify-end rounded-xl bg-[#701832] p-4 text-sm text-white transition-colors duration-300 hover:bg-[#551226]`}
    >
      <p>리뷰 작성하기</p>
      <FaArrowRight className={`ml-1 text-lg`} />
    </Link>
  );
}
