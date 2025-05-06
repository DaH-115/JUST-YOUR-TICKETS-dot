import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "firebase-config";

export function useNicknameValidation() {
  const checkNicknameDuplicate = async (nickname: string) => {
    const nicknameQuery = query(
      collection(db, "users"),
      where("displayName", "==", nickname),
      limit(1),
    );
    const nicknameSnapshot = await getDocs(nicknameQuery);
    return !nicknameSnapshot.empty;
  };

  return { checkNicknameDuplicate };
}
