import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "firebase-config";

/**
 * 타임스탬프와 랜덤 문자열을 조합하여 닉네임을 생성
 * @returns 생성된 닉네임
 */
const generateNickname = (): string => {
  // 1) 타임스탬프로 기본 닉네임 생성
  const timestamp = Date.now().toString().slice(-8);
  const base = `user${timestamp}`;

  // 2) 랜덤 3글자 덧붙이기
  const suffix = Math.random().toString(36).substring(2, 5);
  return `${base}_${suffix}`;
};

/**
 * uid를 기반으로 generateNickname()이 반환하는 랜덤 문자열을
 * Firestore 트랜잭션으로 중복 검사하여 유일한 닉네임을 생성
 * @param uid - 사용자 고유 ID
 * @returns 고유 보장된 닉네임
 */
export default async function generateUniqueNickname(
  uid: string,
): Promise<string> {
  while (true) {
    const candidate = generateNickname();
    const nickRef = doc(db, "usernames", candidate);

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(nickRef);
        if (snap.exists()) {
          throw new Error("DUPLICATE");
        }
        tx.set(nickRef, { uid, createdAt: serverTimestamp() });
      });
      // 트랜잭션이 성공하면 candidate가 유일하다는 뜻
      return candidate;
    } catch (e: any) {
      // DUPLICATE 혹은 충돌 발생 시 재시도
      continue;
    }
  }
}
