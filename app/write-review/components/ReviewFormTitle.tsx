import { useFormContext, Controller } from "react-hook-form";
import { ReviewFormValues } from "app/write-review/[id]/page";

export default function ReviewFormTitle() {
  const { control, getValues } = useFormContext<ReviewFormValues>();

  return (
    <div className="mb-6">
      <label
        htmlFor="reviewTitle"
        className="mb-1 block text-xl font-bold text-gray-900"
      >
        리뷰 제목
      </label>
      <div className="px-2">
        <Controller
          name="reviewTitle"
          control={control}
          defaultValue={getValues("reviewTitle")}
          rules={{
            required: "제목을 입력해주세요.",
            maxLength: {
              value: 50,
              message: "제목은 50자 이하로 입력해주세요.",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                {...field}
                id="reviewTitle"
                className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="리뷰 제목을 입력해주세요"
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
