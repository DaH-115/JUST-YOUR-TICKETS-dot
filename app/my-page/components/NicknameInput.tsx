import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState, useCallback } from "react";
import debounce from "lodash/debounce";
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

  const debounceHandler = useMemo(
    () =>
      debounce(async (value: string) => {
        const isDup = await checkNicknameDuplicate(value);
        setDuplicateError(isDup ? "이미 사용 중인 닉네임입니다." : null);
      }, 500),
    [checkNicknameDuplicate],
  );

  useEffect(() => {
    if (!watchedValue || watchedValue === originalValue) {
      setDuplicateError(null);
      return;
    }
    debounceHandler(watchedValue);
    return () => debounceHandler.cancel();
  }, [watchedValue, originalValue, debounceHandler]);

  return (
    <div>
      <label
        htmlFor="displayName"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        닉네임
      </label>
      {isEditing ? (
        <>
          <input
            id="displayName"
            {...register("displayName")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="닉네임을 입력하세요"
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
