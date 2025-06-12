// 로그인 상태 유지 관련 유틸리티 함수들

const REMEMBER_ME_KEY = "rememberMe";
const AUTH_PERSISTENCE_KEY = "authPersistence";

/**
 * 로그인 상태 유지 설정을 저장합니다.
 */
export const setRememberMe = (remember: boolean): void => {
  if (remember) {
    localStorage.setItem(REMEMBER_ME_KEY, "true");
    localStorage.setItem(AUTH_PERSISTENCE_KEY, "local");
  } else {
    localStorage.removeItem(REMEMBER_ME_KEY);
    sessionStorage.setItem(AUTH_PERSISTENCE_KEY, "session");
  }
};

/**
 * 로그인 상태 유지 설정을 가져옵니다.
 */
export const getRememberMe = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REMEMBER_ME_KEY) === "true";
};

/**
 * 현재 persistence 타입을 가져옵니다.
 */
export const getCurrentPersistence = (): "local" | "session" | null => {
  if (typeof window === "undefined") return null;

  const localPersistence = localStorage.getItem(AUTH_PERSISTENCE_KEY);
  const sessionPersistence = sessionStorage.getItem(AUTH_PERSISTENCE_KEY);

  return (
    (localPersistence as "local") || (sessionPersistence as "session") || null
  );
};

/**
 * 로그아웃 시 persistence 설정을 정리합니다.
 */
export const clearAuthPersistence = (): void => {
  localStorage.removeItem(REMEMBER_ME_KEY);
  localStorage.removeItem(AUTH_PERSISTENCE_KEY);
  sessionStorage.removeItem(AUTH_PERSISTENCE_KEY);
};

/**
 * 브라우저 종료 시 세션 스토리지만 사용하는 경우 로그아웃 처리
 */
export const handleBrowserClose = (): void => {
  const persistence = getCurrentPersistence();
  if (persistence === "session") {
    // 세션 스토리지 사용 시에는 브라우저 종료 시 자동으로 정리됨
    // 추가적인 정리가 필요한 경우 여기에 구현
  }
};
