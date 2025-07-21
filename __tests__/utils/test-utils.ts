import { NextRequest } from "next/server";

// 테스트용 타입 정의들
interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  emailVerified: boolean;
}

interface MockSignupData {
  displayName: string;
  email: string;
  password: string;
}

interface MockSocialSetupData {
  provider: string;
}

interface MockAvailabilityCheckData {
  type: string;
  value: string;
}

interface FirebaseError extends Error {
  code: string;
}

/**
 * NextRequest 객체를 모킹하기 위한 헬퍼 함수
 * @param {object} options - method, url, body 등을 포함하는 요청 객체
 * @returns {NextRequest} 모킹된 NextRequest 객체
 */
export function createMockRequest(options: {
  method?: string;
  url?: string;
  body?: Record<string, unknown> | null;
  headers?: Record<string, string>;
}): NextRequest {
  const {
    method = "GET",
    url = "http://localhost/api/test",
    body = null,
    headers = { "Content-Type": "application/json" },
  } = options;

  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers,
  });

  return request;
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
export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
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
export function createMockFirebaseError(
  code: string,
  message: string,
): FirebaseError {
  const error = new Error(message) as FirebaseError;
  error.code = code;
  return error;
}

/**
 * 테스트용 회원가입 요청 데이터를 생성합니다
 */
export function createMockSignupData(
  overrides: Partial<MockSignupData> = {},
): MockSignupData {
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
export function createMockSocialSetupData(
  overrides: Partial<MockSocialSetupData> = {},
): MockSocialSetupData {
  return {
    provider: "google",
    ...overrides,
  };
}

/**
 * 테스트용 중복 확인 요청 데이터를 생성합니다
 */
export function createMockAvailabilityCheckData(
  overrides: Partial<MockAvailabilityCheckData> = {},
): MockAvailabilityCheckData {
  return {
    type: "displayName",
    value: "testuser",
    ...overrides,
  };
}

// testing-library의 모든 것을 다시 export (기본 render 포함)
export * from "@testing-library/react";
