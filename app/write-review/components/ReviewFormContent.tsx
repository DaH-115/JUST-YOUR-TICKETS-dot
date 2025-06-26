import { useFormContext, Controller } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/[id]/page";

export default function ReviewFormContent() {
  const { control, getValues } = useFormContext<ReviewFormValues>();

  return (
    <div className="space-y-2">
      <label
        htmlFor="reviewContent"
        className="block text-sm font-medium text-gray-700"
      >
        리뷰 내용
      </label>
      <Controller
        name="reviewContent"
        control={control}
        defaultValue={getValues("reviewContent") || ""}
        rules={{
          required: "내용을 입력해주세요.",
          maxLength: {
            value: 500,
            message: "리뷰 내용은 500자 이하로 입력해주세요.",
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <div className="space-y-2">
            <textarea
              {...field}
              id="reviewContent"
              rows={6}
              className={`w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-300 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/50 ${
                error ? "border-red-500 bg-red-50 ring-2 ring-red-500/30" : ""
              }`}
              placeholder="영화에 대한 감상을 자유롭게 작성해주세요."
            />
            <div className="flex justify-between">
              {error && (
                <p className="flex items-center space-x-1 text-sm text-red-600">
                  <span>⚠</span>
                  <span>{error.message}</span>
                </p>
              )}
              <p className="ml-auto text-sm text-gray-400">
                {(field.value || "").length}/500
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
