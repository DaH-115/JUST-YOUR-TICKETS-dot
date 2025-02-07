export function isDevEnvironment() {
  return process.env.NODE_ENV === "development";
}

// 쿠키 옵션 생성 함수
export const createCookieOptions = (
  isRemembered: boolean,
): {
  maxAge?: number;
  path: string;
  sameSite: string;
  secure: boolean;
} => {
  // 개발 환경일 때의 설정
  if (isDevEnvironment()) {
    return {
      maxAge: isRemembered ? 300 : undefined, // 5분
      path: "/",
      sameSite: "lax",
      secure: false,
    };
  } else {
    // 프로덕션 환경일 때의 설정
    return {
      maxAge: isRemembered ? 2592000 : undefined, // 30일
      path: "/",
      sameSite: "strict",
      secure: true,
    };
  }
};

// 쿠키 설정 함수
export const setCookie = (token: string, isRemembered: boolean): void => {
  const options = createCookieOptions(isRemembered);

  // 쿠키 문자열 생성
  const cookieParts = [
    `firebase-session-token=${token}`,
    options.maxAge ? `max-age=${options.maxAge}` : "",
    `path=${options.path}`,
    `samesite=${options.sameSite}`,
    options.secure ? "secure" : "",
  ];

  // 빈 문자열 제거하고 쿠키 설정
  const cookieString = cookieParts.filter((part) => part !== "").join("; ");
  document.cookie = cookieString;
};

// 쿠키 삭제 함수
export const removeCookie = (): void => {
  document.cookie = "firebase-session-token=; max-age=0; path=/";
};

// 쿠키 확인 함수
export const getCookie = (): string | null => {
  const cookies = document.cookie.split(";");

  // 각 쿠키를 순회하면서 찾기
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "firebase-session-token") {
      return value;
    }
  }
  return null;
};
