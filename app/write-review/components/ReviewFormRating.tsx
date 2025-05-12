import { useFormContext, Controller } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/[id]/page";
import { IoStar } from "react-icons/io5";

export default function ReviewFormRating() {
  const { control, getValues } = useFormContext<ReviewFormValues>();

  return (
    <div className="mb-6">
      <label
        htmlFor="rating"
        className="mb-2 block text-xl font-bold text-gray-900"
      >
        평점
      </label>
      <div className="flex items-center">
        <Controller
          name="rating"
          control={control}
          defaultValue={getValues("rating")}
          rules={{
            validate: (value) => value > 0 || "평점을 선택해주세요.",
          }}
          render={({ field, fieldState: { error } }) => (
            <div className="flex w-full flex-col items-center justify-center">
              <div className="w-[90%]">
                <input
                  {...field}
                  type="range"
                  id="rating"
                  min={0}
                  max={5}
                  className="w-full"
                />
                <div
                  className={`flex ${error ? "justify-between" : "justify-end"}`}
                >
                  {error && (
                    <p className="text-sm text-red-600">{error.message}</p>
                  )}
                  <div className="flex items-center justify-center px-2 text-3xl font-bold">
                    <IoStar className="mr-1 text-accent-300" />
                    {field.value}
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
