import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

interface ReviewFormHeaderProps {
  movieTitle: string;
  isEditMode?: boolean;
}

export default function ReviewFormHeader({
  movieTitle,
  isEditMode = false,
}: ReviewFormHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8 flex items-center justify-between">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-black"
      >
        <IoIosArrowBack />
        뒤로가기
      </button>
      <h1 className="text-xl font-bold">
        {isEditMode ? "리뷰 수정하기" : "리뷰 작성하기"}
      </h1>
    </div>
  );
}
