import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/components/ReviewForm";

interface ReviewFormTitleProps {
  register: UseFormRegister<ReviewFormValues>;
  errors: FieldErrors<ReviewFormValues>;
  isEditMode?: boolean;
}

export default function ReviewFormTitle({
  register,
  errors,
  isEditMode = false,
}: ReviewFormTitleProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="reviewTitle"
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        리뷰 제목
      </label>
      <input
        type="text"
        id="reviewTitle"
        {...register("reviewTitle")}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        placeholder="리뷰 제목을 입력해주세요"
        disabled={isEditMode && false}
      />
      {errors.reviewTitle && (
        <p className="mt-2 text-sm text-red-600">
          {errors.reviewTitle.message}
        </p>
      )}
    </div>
  );
}
