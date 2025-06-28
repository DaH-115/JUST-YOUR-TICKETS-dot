import { useFormContext, Controller } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/types";

export default function ReviewFormTitle() {
  const { control, getValues } = useFormContext<ReviewFormValues>();

  return (
    <div className="space-y-2">
      <label
        htmlFor="reviewTitle"
        className="block text-sm font-medium text-gray-700"
      >
        리뷰 제목
      </label>
      <Controller
        name="reviewTitle"
        control={control}
        defaultValue={getValues("reviewTitle") || ""}
        rules={{
          required: "제목을 입력해주세요.",
          maxLength: {
            value: 50,
            message: "제목은 50자 이하로 입력해주세요.",
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <div className="space-y-2">
            <input
              {...field}
              id="reviewTitle"
              className={`w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-300 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/50 ${
                error ? "border-red-500 bg-red-50 ring-2 ring-red-500/30" : ""
              }`}
              placeholder="리뷰 제목을 입력해주세요"
            />
            <div className="flex justify-between">
              {error && (
                <p className="flex items-center space-x-1 text-sm text-red-600">
                  <span>⚠</span>
                  <span>{error.message}</span>
                </p>
              )}
              <p className="ml-auto text-sm text-gray-400">
                {(field.value || "").length}/50
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
