import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "store/context/alertContext";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import {
  updateUserProfile,
  selectUser,
} from "store/redux-toolkit/slice/userSlice";

// 프로필 편집 폼에서 사용하는 값 타입 정의
interface ProfileEditFormValues {
  displayName?: string;
  biography?: string;
  photoKey?: string;
}

/**
 * 프로필 편집 폼의 비즈니스 로직(상태, API 호출, Alert, 라우팅 등)을 담당하는 커스텀 훅
 * - UI 컴포넌트는 이 훅에서 반환하는 onSubmit, isSubmitting만 사용하면 됨
 * - 테스트/협업/유지보수에 용이하도록 모든 부수효과를 훅 내부에서 처리
 * @returns { onSubmit, isSubmitting }
 */
export function useProfileEditForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showErrorHandler, showSuccessHandler } = useAlert();
  const user = useAppSelector(selectUser);
  // 폼 제출 중 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 프로필 수정 폼 제출 핸들러
   * @param data - 폼 입력값 (displayName, biography, photoKey 등)
   * @returns void
   */
  const onSubmit = async (data: ProfileEditFormValues) => {
    setIsSubmitting(true);
    try {
      // 로그인 상태가 아니면 에러 처리
      if (!user?.uid) {
        showErrorHandler("오류", "로그인이 필요합니다.");
        setIsSubmitting(false);
        return;
      }
      // Redux Thunk로 프로필 업데이트 API 호출
      await dispatch(updateUserProfile({ uid: user.uid, data })).unwrap();
      // 성공 시 알림 및 마이페이지 이동
      showSuccessHandler("성공", "프로필이 성공적으로 수정되었습니다.", () => {
        router.push("/my-page");
      });
    } catch (error) {
      // 실패 시 에러 메시지 알림
      const message =
        error instanceof Error ? error.message : "프로필 수정에 실패했습니다.";
      showErrorHandler("오류", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI에서는 onSubmit, isSubmitting만 사용
  return { onSubmit, isSubmitting };
}
