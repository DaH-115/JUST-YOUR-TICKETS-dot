import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { useFormContext } from "react-hook-form";

interface ReviewFormHeaderProps {
  setShowExitConfirmation: (show: boolean) => void;
  isEditMode?: boolean;
}

export default function ReviewFormHeader({
  setShowExitConfirmation,
  isEditMode = false,
}: ReviewFormHeaderProps) {
  const router = useRouter();
  const {
    formState: { isDirty },
  } = useFormContext();

  const pageExitHandler = useCallback(() => {
    if (isDirty) {
      setShowExitConfirmation(true);
    } else {
      router.back();
    }
  }, [router, isDirty]);

  return (
    <div className="flex items-center justify-between border-b-2 p-4">
      <button
        type="button"
        onClick={pageExitHandler}
        className="flex items-center text-gray-600 transition-colors hover:text-black"
      >
        <IoIosArrowBack size={18} />
        뒤로가기
      </button>
      <h1 className="text-xl font-bold">
        {isEditMode ? "리뷰 수정하기" : "리뷰 작성하기"}
      </h1>
    </div>
  );
}
