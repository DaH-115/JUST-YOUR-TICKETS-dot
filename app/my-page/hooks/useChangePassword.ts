// 비밀번호 변경(재인증, 변경, 상태/에러 관리 등) 비즈니스 로직을 담당하는 커스텀 훅
// - UI 컴포넌트는 이 훅에서 반환하는 상태와 함수만 사용하면 됨
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "store/context/alertContext";
import { isAuth } from "firebase-config";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { firebaseErrorHandler } from "app/utils/firebaseError";

export function useChangePassword() {
  const router = useRouter();
  const currentUser = isAuth.currentUser;
  const user = useAppSelector(selectUser);
  const { showErrorHandler, showSuccessHandler } = useAlert();

  // 상태: 인증 성공, 인증 중, 변경 중, 에러
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 비밀번호 재인증
  const onVerifyCurrent = async (data: { currentPassword: string }) => {
    if (!currentUser || !user?.email) {
      const msg = "사용자 정보가 올바르지 않습니다.";
      showErrorHandler("오류", msg);
      setError(msg);
      return;
    }
    setIsVerifying(true);
    setError(null);
    try {
      const cred = EmailAuthProvider.credential(
        user.email,
        data.currentPassword,
      );
      await reauthenticateWithCredential(currentUser, cred);
      setIsVerified(true);
      setIsVerifying(false);
      showSuccessHandler("확인", "비밀번호가 확인되었습니다.");
    } catch (error) {
      const { title, message } = firebaseErrorHandler(error);
      setIsVerifying(false);
      setIsVerified(false);
      setError(message);
      showErrorHandler(title, message);
    }
  };

  // 새 비밀번호 변경
  const onChangePassword = async (data: { newPassword: string }) => {
    if (!currentUser) {
      const msg = "사용자가 로그인되어 있지 않습니다.";
      showErrorHandler("오류", msg);
      setError(msg);
      router.push("/login");
      return;
    }
    setIsUpdating(true);
    setError(null);
    try {
      await updatePassword(currentUser, data.newPassword);
      setIsVerified(false);
      setIsUpdating(false);
      showSuccessHandler("성공", "비밀번호가 성공적으로 변경되었습니다.");
    } catch (error) {
      const { title, message } = firebaseErrorHandler(error);
      setIsUpdating(false);
      setError(message);
      showErrorHandler(title, message);
    }
  };

  return {
    isVerified,
    isVerifying,
    isUpdating,
    error,
    onVerifyCurrent,
    onChangePassword,
  };
}
