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

/**
 * API 요청용 Authorization 헤더를 생성합니다.
 *
 * @param forceRefresh - 토큰을 강제로 새로고침할지 여부 (기본값: false)
 * @returns Authorization 헤더 객체 또는 빈 객체
 */
export async function getAuthHeaders(
  forceRefresh: boolean = false,
): Promise<Record<string, string>> {
  const idToken = await getIdToken(forceRefresh);

  if (!idToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${idToken}`,
  };
}

/**
 * 토큰 만료 시 자동으로 새로고침하여 API 요청을 재시도합니다.
 *
 * @param apiCall - API 호출 함수
 * @param maxRetries - 최대 재시도 횟수 (기본값: 1)
 * @returns API 응답
 */
export async function apiCallWithTokenRefresh<T>(
  apiCall: (headers: Record<string, string>) => Promise<T>,
  maxRetries: number = 1,
): Promise<T> {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const headers = await getAuthHeaders(attempt > 0); // 재시도 시 토큰 새로고침
      return await apiCall(headers);
    } catch (error) {
      // 토큰 만료 에러인 경우 재시도
      if (attempt < maxRetries) {
        let message;
        let status;
        if (typeof error === "object" && error !== null) {
          if ("message" in error)
            message = (error as { message: string }).message;
          if ("status" in error) status = (error as { status: number }).status;
        }

        if (
          (message &&
            (message.includes("토큰이 만료") ||
              message.includes("token expired"))) ||
          status === 401
        ) {
          // 토큰 만료로 인한 재시도
          attempt++;
          continue;
        }
      }

      throw error;
    }
  }

  throw new Error("최대 재시도 횟수를 초과했습니다.");
}
