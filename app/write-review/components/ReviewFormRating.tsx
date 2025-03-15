import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/components/ReviewForm";

interface ReviewFormRatingProps {
  register: UseFormRegister<ReviewFormValues>;
  errors: FieldErrors<ReviewFormValues>;
  watch: UseFormWatch<ReviewFormValues>;
  isEditMode?: boolean;
}

export default function ReviewFormRating({
  register,
  errors,
  watch,
  isEditMode = false,
}: ReviewFormRatingProps) {
  const rating = watch("rating");

  return (
    <div className="mb-6">
      <label
        htmlFor="rating"
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        평점
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          id="rating"
          min="0"
          max="5"
          step="0.5"
          {...register("rating", { valueAsNumber: true })}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
          disabled={isEditMode && false}
        />
        <span className="text-xl font-bold">{rating}</span>
      </div>
      {errors.rating && (
        <p className="mt-2 text-sm text-red-600">{errors.rating.message}</p>
      )}
    </div>
  );
}
