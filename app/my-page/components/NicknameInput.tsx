import { useFormContext, useWatch } from "react-hook-form";
import DuplicateCheckButton from "app/components/ui/buttons/DuplicateCheckButton";
import { useNicknameCheck } from "app/my-page/hooks/useNicknameCheck";

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
    formState: { errors: formErrors },
  } = useFormContext();

  const watchedNickname = useWatch({ name: "displayName", control });

  const { isChecking, isChecked, isAvailable, message, checkNickname } =
    useNicknameCheck({
      nickname: watchedNickname,
      originalNickname: originalValue,
    });

  // 닉네임 유효성 검사 에러 또는 중복 확인 에러를 표시
  const displayError =
    formErrors.displayName?.message || (isAvailable === false ? message : null);

  // 중복 확인 버튼의 비활성화 조건
  const isDuplicateCheckDisabled =
    !watchedNickname ||
    watchedNickname.trim() === "" ||
    !!formErrors.displayName ||
    isChecking ||
    (isChecked && isAvailable === true);

  // 중복 확인 성공 메시지를 보여줄 조건
  const showSuccessMessage =
    isChecked && isAvailable && message && watchedNickname !== originalValue;

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
          <div className="flex gap-2">
            <input
              id="displayName"
              {...register("displayName")}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-300 focus:ring-offset-1"
              placeholder="닉네임을 입력하세요"
            />
            <DuplicateCheckButton
              onClick={checkNickname}
              disabled={isDuplicateCheckDisabled}
              isChecking={isChecking}
              className="self-start"
              aria-label="닉네임 중복 확인"
              aria-describedby={isChecking ? "nickname-checking" : undefined}
            />
          </div>
          {displayError && (
            <p className="mt-1 text-xs text-red-500">
              {displayError as string}
            </p>
          )}
          {showSuccessMessage && (
            <p className="mt-1 text-xs text-green-600">{message}</p>
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
