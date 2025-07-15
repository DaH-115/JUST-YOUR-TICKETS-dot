interface ReviewFormHeaderProps {
  isEditMode?: boolean;
}

export default function ReviewFormHeader({
  isEditMode = false,
}: ReviewFormHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-xl font-bold text-gray-800">
        {isEditMode ? "리뷰 수정하기" : "리뷰 작성하기"}
      </h1>
    </div>
  );
}
