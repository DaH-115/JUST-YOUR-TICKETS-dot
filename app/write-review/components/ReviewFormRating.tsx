import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { useFormContext, Controller } from "react-hook-form";
import { IoChevronDown } from "react-icons/io5";
import { FaExclamationTriangle, FaStar } from "react-icons/fa";
import { ReviewFormValues } from "app/write-review/types";

const ratingOptions = [
  { value: 1, label: "1점", stars: 1, description: "매우 나쁨" },
  { value: 2, label: "2점", stars: 1, description: "나쁨" },
  { value: 3, label: "3점", stars: 2, description: "별로" },
  { value: 4, label: "4점", stars: 2, description: "그저 그럼" },
  { value: 5, label: "5점", stars: 3, description: "보통" },
  { value: 6, label: "6점", stars: 3, description: "괜찮음" },
  { value: 7, label: "7점", stars: 4, description: "좋음" },
  { value: 8, label: "8점", stars: 4, description: "매우 좋음" },
  { value: 9, label: "9점", stars: 5, description: "훌륭함" },
  { value: 10, label: "10점", stars: 5, description: "완벽함" },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex space-x-1">
    {Array.from({ length: count }, (_, i) => (
      <FaStar key={i} className="text-accent-400" size={14} />
    ))}
  </div>
);

export default function ReviewFormRating() {
  const { control } = useFormContext<ReviewFormValues>();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">평점</label>

      <Controller
        name="rating"
        control={control}
        defaultValue={5}
        rules={{ validate: (value) => value > 0 || "평점을 선택해주세요." }}
        render={({ field, fieldState: { error } }) => {
          const selected = ratingOptions.find(
            (opt) => opt.value === field.value,
          );

          return (
            <div className="relative">
              <Listbox value={field.value} onChange={field.onChange}>
                <ListboxButton
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-all focus:outline-none focus:ring-1 focus:ring-accent-300 focus:ring-offset-1 ${
                    error
                      ? "border-red-500 bg-red-50 ring-2 ring-red-500/30"
                      : "border-gray-200 bg-gray-50 focus:border-accent-500 focus:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {selected ? (
                        <>
                          <Stars count={selected.stars} />
                          <span className="text-gray-800">
                            {selected.label}
                            {selected.description &&
                              ` - ${selected.description}`}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400">
                          평점을 선택해주세요
                        </span>
                      )}
                    </div>
                    <IoChevronDown
                      className="transition-transform data-[open]:rotate-180"
                      size={16}
                    />
                  </div>
                </ListboxButton>

                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border-2 border-gray-200 bg-white shadow-lg focus:outline-none">
                  {ratingOptions.map((option) => (
                    <ListboxOption
                      key={option.value}
                      value={option.value}
                      className="flex cursor-pointer items-center space-x-3 px-4 py-3 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-accent-50 data-[focus]:bg-accent-100 data-[selected]:bg-accent-50"
                    >
                      <Stars count={option.stars} />
                      <span className="text-gray-800">
                        {option.label}
                        {option.description && ` - ${option.description}`}
                      </span>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>

              {error && (
                <p className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                  <span>
                    <FaExclamationTriangle />
                  </span>
                  <span>{error.message}</span>
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
