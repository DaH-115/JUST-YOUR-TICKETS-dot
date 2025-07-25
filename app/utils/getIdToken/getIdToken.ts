import { isAuth } from "firebase-config";

/**
 * 현재 로그인된 사용자의 Firebase ID Token을 가져옵니다.
 *
 * @param forceRefresh - 토큰을 강제로 새로고침할지 여부 (기본값: false)
 * @returns Firebase ID Token 또는 null
 */
export async function getIdToken(
  forceRefresh: boolean = false,
): Promise<string | null> {
  try {
    const currentUser = isAuth.currentUser;
    if (!currentUser) {
      console.warn("사용자가 로그인되어 있지 않습니다.");
      return null;
    }
    // Firebase ID Token 가져오기
    const idToken = await currentUser.getIdToken(forceRefresh);
    return idToken;
  } catch (error) {
    console.error("ID Token 가져오기 실패:", error);
    return null;
  }
}
