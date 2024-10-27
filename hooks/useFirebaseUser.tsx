import { getAuth } from "firebase/auth";
import { useAppSelector } from "store/hooks";

export default function useFirebaseUser() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const serializedUser = useAppSelector((state) => state.user.user);
  const userStatus = useAppSelector((state) => state.user.status);

  return {
    currentUser, // Firebase 작업용
    serializedUser, // UI 표시용
    userStatus, // 로딩 상태 확인용
    isLoading: userStatus === "loading",
  };
}
