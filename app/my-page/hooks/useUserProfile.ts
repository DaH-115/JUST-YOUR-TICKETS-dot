import { useState, useEffect } from "react";
import { doc, getDoc, FieldValue, Timestamp } from "firebase/firestore";
import { db } from "firebase-config";
import { useError } from "store/context/errorContext";
import { firebaseErrorHandler } from "app/utils/firebaseError";

export interface UserDoc {
  displayName: string;
  biography: string;
  updatedAt: Timestamp | FieldValue;
  provider: string;
}

export function useUserProfile(uid: string | undefined) {
  const [userDoc, setUserDoc] = useState<UserDoc>();
  const [isLoading, setIsLoading] = useState(false);
  const { isShowError } = useError();

  useEffect(() => {
    if (!uid) return;

    setIsLoading(true);
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", uid);

      try {
        const user = await getDoc(userDocRef);

        if (user.exists()) {
          const userDoc = user.data() as UserDoc;
          setUserDoc(userDoc);
        } else {
          isShowError("데이터 없음", "사용자 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        if (error instanceof Error) {
          window.alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
        } else {
          const { title, message } = firebaseErrorHandler(error);
          isShowError(title, message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [uid, isShowError]);

  return { userDoc, isLoading, setUserDoc };
}
