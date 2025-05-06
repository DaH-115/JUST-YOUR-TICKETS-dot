import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/components/ReviewForm";

interface ReviewFormContentProps {
  register: UseFormRegister<ReviewFormValues>;
  watch: UseFormWatch<ReviewFormValues>;
  errors: FieldErrors<ReviewFormValues>;
  isEditMode?: boolean;
}

export default function ReviewFormContent({
  register,
  watch,
  errors,
  isEditMode = false,
}: ReviewFormContentProps) {
  const watchReviewContent = watch("reviewContent");

  return (
    <div className="mb-6">
      <label
        htmlFor="reviewContent"
        className="mb-1 block text-xl font-bold text-gray-900"
      >
        리뷰 내용
      </label>
      <div className="px-2">
        <textarea
          id="reviewContent"
          rows={6}
          {...register("reviewContent", {
            required: "내용을 입력해주세요.",
            maxLength: {
              value: 500,
              message: "리뷰 내용은 500자 이하로 입력해주세요.",
            },
          })}
          className="block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="영화에 대한 감상을 자유롭게 작성해주세요."
          disabled={isEditMode && false}
        />
        <p className="text-right text-sm text-gray-400">
          {watchReviewContent.length}/500
        </p>
        {errors.reviewContent && (
          <p className="mt-2 text-sm text-red-600">
            {errors.reviewContent.message}
          </p>
        )}
      </div>
    </div>
  );
}
