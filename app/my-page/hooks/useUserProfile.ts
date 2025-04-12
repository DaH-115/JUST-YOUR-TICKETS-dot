import { useState, useEffect } from "react";
import { doc, getDoc, FieldValue, Timestamp } from "firebase/firestore";
import { db } from "firebase-config";
import { useAlert } from "store/context/alertContext";
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
  const { showErrorHanlder } = useAlert();

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
          showErrorHanlder("오류", "사용자 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        if (error instanceof Error) {
          showErrorHanlder("오류", error.message);
        } else {
          const { title, message } = firebaseErrorHandler(error);
          showErrorHanlder(title, message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [uid, showErrorHanlder]);

  return { userDoc, isLoading, setUserDoc };
}
