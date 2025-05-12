import { useFormContext, Controller } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/[id]/page";

export default function ReviewFormContent() {
  const { control, getValues } = useFormContext<ReviewFormValues>();

  return (
    <div className="mb-6">
      <label
        htmlFor="reviewContent"
        className="mb-1 block text-xl font-bold text-gray-900"
      >
        리뷰 내용
      </label>
      <div className="px-2">
        <Controller
          name="reviewContent"
          control={control}
          defaultValue={getValues("reviewContent")}
          rules={{
            required: "내용을 입력해주세요.",
            maxLength: {
              value: 500,
              message: "리뷰 내용은 500자 이하로 입력해주세요.",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <textarea
                {...field}
                id="reviewContent"
                rows={6}
                className="block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="영화에 대한 감상을 자유롭게 작성해주세요."
              />
              <div
                className={`mt-1 flex ${error ? "justify-between" : "justify-end"}`}
              >
                {error && (
                  <p className="text-sm text-red-600">{error.message}</p>
                )}
                <p className="text-right text-sm text-gray-400">
                  {field.value.length}/50
                </p>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
}
