import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/components/ReviewForm";

interface ReviewFormContentProps {
  register: UseFormRegister<ReviewFormValues>;
  errors: FieldErrors<ReviewFormValues>;
  isEditMode?: boolean;
}

export default function ReviewFormContent({
  register,
  errors,
  isEditMode = false,
}: ReviewFormContentProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="reviewContent"
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        리뷰 내용
      </label>
      <textarea
        id="reviewContent"
        rows={6}
        {...register("reviewContent")}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        placeholder="영화에 대한 감상을 자유롭게 작성해주세요."
        disabled={isEditMode && false}
      ></textarea>
      {errors.reviewContent && (
        <p className="mt-2 text-sm text-red-600">
          {errors.reviewContent.message}
        </p>
      )}
    </div>
  );
}
