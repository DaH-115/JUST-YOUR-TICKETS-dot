import { db } from "firebase-config";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

export default async function onGenerateNickname(): Promise<string> {
  // timestamp를 이용해 고유한 닉네임 생성
  const timestamp = Date.now().toString().slice(-8);
  const baseNickname = `user${timestamp}`;

  // 혹시 모를 중복 체크
  const nicknameQuery = query(
    collection(db, "users"),
    where("nickname", "==", baseNickname),
    limit(1),
  );
  const nicknameSnapshot = await getDocs(nicknameQuery);

  if (nicknameSnapshot.empty) {
    return baseNickname;
  }

  // 중복이면 랜덤 문자 추가
  return `${baseNickname}_${Math.random().toString(36).slice(2, 5)}`;
}
