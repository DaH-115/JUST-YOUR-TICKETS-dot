import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/components/ReviewForm";

interface ReviewFormTitleProps {
  register: UseFormRegister<ReviewFormValues>;
  watch: UseFormWatch<ReviewFormValues>;
  errors: FieldErrors<ReviewFormValues>;
  isEditMode?: boolean;
}

export default function ReviewFormTitle({
  register,
  watch,
  errors,
  isEditMode = false,
}: ReviewFormTitleProps) {
  const watchReviewTitle = watch("reviewTitle");

  return (
    <div className="mb-6">
      <label
        htmlFor="reviewTitle"
        className="mb-1 block text-xl font-bold text-gray-900"
      >
        리뷰 제목
      </label>
      <div className="px-2">
        <input
          type="text"
          id="reviewTitle"
          {...register("reviewTitle", {
            required: "제목을 입력해주세요.",
            maxLength: {
              value: 50,
              message: "제목은 50자 이하로 입력해주세요.",
            },
          })}
          className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="리뷰 제목을 입력해주세요"
          disabled={isEditMode && false}
        />
        <p className="text-right text-sm text-gray-400">
          {watchReviewTitle.length}/50
        </p>
        {errors.reviewTitle && (
          <p className="mt-2 text-sm text-red-600">
            {errors.reviewTitle.message}
          </p>
        )}
      </div>
    </div>
  );
}
