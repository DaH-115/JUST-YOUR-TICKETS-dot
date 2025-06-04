import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { useNicknameValidation } from "app/my-page/hooks/useNicknameValidation";

interface NicknameInputProps {
  originalValue?: string | null;
  isEditing: boolean;
}

export default function NicknameInput({
  originalValue,
  isEditing,
}: NicknameInputProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const watchedValue = useWatch({ name: "displayName", control });
  const { checkNicknameDuplicate } = useNicknameValidation();

  useEffect(() => {
    if (!watchedValue || watchedValue === originalValue) {
      setDuplicateError(null);
      return;
    }

    const check = debounce(async (value: string) => {
      const isDuplicate = await checkNicknameDuplicate(value);
      setDuplicateError(isDuplicate ? "이미 사용 중인 닉네임입니다." : null);
    }, 500);

    check(watchedValue);
    return () => check.cancel();
  }, [watchedValue, originalValue, checkNicknameDuplicate]);

  return (
    <div className="mb-2">
      <label htmlFor="displayName" className="text-xs font-semibold">
        닉네임
      </label>
      {isEditing ? (
        <>
          <input
            id="displayName"
            {...register("displayName")}
            className="mt-2 w-full rounded-xl border border-black px-3 py-2"
          />
          {errors.displayName?.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.displayName.message as string}
            </p>
          )}
          {duplicateError && !errors.displayName && (
            <p className="mt-1 text-xs text-red-500">{duplicateError}</p>
          )}
        </>
      ) : (
        <div className="mt-1">
          <p className="border-b border-gray-500 py-2 text-gray-800">
            {originalValue || "없음"}
          </p>
        </div>
      )}
    </div>
  );
}
