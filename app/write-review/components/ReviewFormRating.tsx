import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/components/ReviewForm";
import { IoStar } from "react-icons/io5";

interface ReviewFormRatingProps {
  register: UseFormRegister<ReviewFormValues>;
  watch: UseFormWatch<ReviewFormValues>;
  errors: FieldErrors<ReviewFormValues>;
  isEditMode?: boolean;
}

export default function ReviewFormRating({
  register,
  errors,
  watch,
  isEditMode = false,
}: ReviewFormRatingProps) {
  const watchRating = watch("rating");

  return (
    <div className="mb-6">
      <label
        htmlFor="rating"
        className="mb-2 block text-xl font-bold text-gray-900"
      >
        평점
      </label>
      <div className="flex items-center">
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
      </div>
      <div className="flex items-center justify-center p-2 text-center text-xl font-bold">
        <IoStar className="mr-1 text-accent-300" size={18} />
        {watchRating}
      </div>
      {errors.rating && (
        <p className="mt-2 text-sm text-red-600">{errors.rating.message}</p>
      )}
    </div>
  );
}
