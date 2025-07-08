import { NextRequest } from "next/server";

/**
 * 테스트용 NextRequest 객체를 생성합니다
 */
export function createMockRequest(
  options: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: any;
  } = {},
): NextRequest {
  const {
    method = "GET",
    url = "http://localhost:3000",
    headers = {},
    body,
  } = options;

  return {
    url,
    method,
    headers: {
      get: (name: string) => headers[name.toLowerCase()],
    },
    json: async () => body || {},
  } as NextRequest;
}

/**
 * 테스트용 인증 토큰을 생성합니다
 */
export function createMockAuthToken(uid: string = "test-user-id"): string {
  // 실제 JWT 토큰 형태로 만들지만, 테스트에서는 mock으로 처리됩니다
  return `mock-jwt-token-${uid}`;
}

/**
 * 테스트용 사용자 데이터를 생성합니다
 */
export function createMockUser(overrides: Partial<any> = {}) {
  return {
    uid: "test-user-id",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: null,
    emailVerified: true,
    ...overrides,
  };
}

/**
 * 테스트용 Firebase Admin 응답을 생성합니다
 */
export function createMockDecodedToken(uid: string = "test-user-id") {
  return {
    uid,
    email: "test@example.com",
    email_verified: true,
    auth_time: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 후 만료
    iat: Math.floor(Date.now() / 1000),
    sub: uid,
    aud: "test-project",
    iss: "https://securetoken.google.com/test-project",
  };
}

/**
 * 테스트용 에러 객체를 생성합니다
 */
export function createMockFirebaseError(code: string, message: string) {
  const error = new Error(message);
  (error as any).code = code;
  return error;
}

/**
 * 테스트용 회원가입 요청 데이터를 생성합니다
 */
export function createMockSignupData(overrides: Partial<any> = {}) {
  return {
    displayName: "Test User",
    email: "test@example.com",
    password: "password123!",
    ...overrides,
  };
}

/**
 * 테스트용 소셜 로그인 설정 데이터를 생성합니다
 */
export function createMockSocialSetupData(overrides: Partial<any> = {}) {
  return {
    provider: "google",
    ...overrides,
  };
}

/**
 * 테스트용 중복 확인 요청 데이터를 생성합니다
 */
export function createMockAvailabilityCheckData(overrides: Partial<any> = {}) {
  return {
    type: "displayName",
    value: "testuser",
    ...overrides,
  };
}
