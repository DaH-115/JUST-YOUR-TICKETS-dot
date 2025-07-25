// 닉네임/이메일 중복 체크 상태 관리 및 UI 메시지 담당 커스텀 훅
// - 비즈니스 로직(실제 API 호출, 에러 가공 등)은 별도 서비스 유틸로 분리
import { useCallback, useEffect, useState } from "react";
import { duplicateCheckService } from "app/my-page/utils/duplicateCheckService";
import { checkDuplicate } from "app/utils/api/checkDuplicate";

export type DuplicateType = "displayName" | "email";

export interface UseDuplicateCheckOptions {
  type: DuplicateType;
  value: string;
  originalValue?: string; // 프로필 수정 시 기존 값
  checkDuplicateFn?: typeof checkDuplicate; // 테스트 시 mock 주입 가능, as 없이 명확하게
}

export function useDuplicateCheck({
  type,
  value,
  originalValue,
  checkDuplicateFn,
}: UseDuplicateCheckOptions) {
  const [isChecking, setIsChecking] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // value/type이 변경될 때마다 상태 초기화
  useEffect(() => {
    setIsChecking(false);
    setIsChecked(false);
    setIsAvailable(null);
    setMessage(null);
  }, [value, type]);

  // 중복 체크 실행 (비즈니스 로직은 서비스 유틸에 위임)
  const check = useCallback(async () => {
    if (!value || value.trim() === "") {
      setIsChecking(false);
      setIsChecked(true);
      setIsAvailable(false);
      setMessage(
        type === "displayName"
          ? "닉네임을 입력해주세요."
          : "이메일을 입력해주세요.",
      );
      return;
    }
    if (originalValue && value === originalValue) {
      setIsChecking(false);
      setIsChecked(false);
      setIsAvailable(null);
      setMessage(null);
      return;
    }
    setIsChecking(true);
    setMessage(null);
    // 실제 사용할 checkDuplicate 함수 결정 (mock 주입 가능)
    const realCheckDuplicate = checkDuplicateFn ?? checkDuplicate;
    const { available, message } = await duplicateCheckService(
      type,
      value,
      realCheckDuplicate,
    );
    setIsChecking(false);
    setIsChecked(true);
    setIsAvailable(available);
    setMessage(message);
  }, [type, value, originalValue, checkDuplicateFn]);

  return { isChecking, isChecked, isAvailable, message, check };
}
