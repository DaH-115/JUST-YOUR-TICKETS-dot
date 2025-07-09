import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { NextRequest } from "next/server";
import { adminAuth } from "firebase-admin-config";
import { createMockFirebaseError } from "__tests__/utils/test-utils";

jest.mock("firebase-admin-config", () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
}));

const mockedVerifyIdToken = adminAuth.verifyIdToken as jest.Mock;

describe("verifyAuthToken", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("성공: 유효한 Bearer 토큰이 제공되면 uid를 반환해야 함", async () => {
    const mockToken = "valid-token";
    const mockUid = "test-uid";
    const headers = new Headers({ Authorization: `Bearer ${mockToken}` });
    const req = new NextRequest("http://localhost", { headers });

    mockedVerifyIdToken.mockResolvedValue({ uid: mockUid });

    const result = await verifyAuthToken(req);

    expect(result).toEqual({ success: true, uid: mockUid });
    expect(mockedVerifyIdToken).toHaveBeenCalledWith(mockToken);
  });

  test("실패: Authorization 헤더가 없으면 401 에러를 반환해야 함", async () => {
    const req = new NextRequest("http://localhost");
    const result = await verifyAuthToken(req);
    expect(result).toEqual({
      success: false,
      error: "로그인이 필요합니다.",
      statusCode: 401,
    });
  });

  test("실패: 토큰 형식이 'Bearer'가 아니면 401 에러를 반환해야 함", async () => {
    const headers = new Headers({ Authorization: "Basic some-token" });
    const req = new NextRequest("http://localhost", { headers });
    const result = await verifyAuthToken(req);
    expect(result).toEqual({
      success: false,
      error: "잘못된 토큰 형식입니다.",
      statusCode: 401,
    });
  });

  test("실패: 토큰이 만료되면(expired) 만료 에러 메시지를 반환해야 함", async () => {
    const mockToken = "expired-token";
    const headers = new Headers({ Authorization: `Bearer ${mockToken}` });
    const req = new NextRequest("http://localhost", { headers });
    const error = createMockFirebaseError(
      "auth/id-token-expired",
      "Token is expired.",
    );
    mockedVerifyIdToken.mockRejectedValue(error);

    const result = await verifyAuthToken(req);

    expect(result).toEqual({
      success: false,
      error: "토큰이 만료되었습니다. 다시 로그인해주세요.",
      statusCode: 401,
    });
  });

  test("실패: 알 수 없는 Firebase 에러 시 일반 에러 메시지를 반환해야 함", async () => {
    const mockToken = "invalid-token";
    const headers = new Headers({ Authorization: `Bearer ${mockToken}` });
    const req = new NextRequest("http://localhost", { headers });
    const error = createMockFirebaseError(
      "auth/some-other-error",
      "Some other error.",
    );
    mockedVerifyIdToken.mockRejectedValue(error);

    const result = await verifyAuthToken(req);

    expect(result).toEqual({
      success: false,
      error: "인증에 실패했습니다.",
      statusCode: 401,
    });
  });
});

describe("verifyResourceOwnership", () => {
  const authenticatedUid = "user-123";

  test("성공: 인증된 사용자와 리소스 소유자가 같으면 true를 반환해야 함", () => {
    const resourceOwnerUid = "user-123";
    const result = verifyResourceOwnership(authenticatedUid, resourceOwnerUid);
    expect(result).toEqual({ success: true, uid: authenticatedUid });
  });

  test("실패: 인증된 사용자와 리소스 소유자가 다르면 403 에러를 반환해야 함", () => {
    const resourceOwnerUid = "user-456";
    const result = verifyResourceOwnership(authenticatedUid, resourceOwnerUid);
    expect(result).toEqual({
      success: false,
      error: "권한이 없습니다.",
      statusCode: 403,
    });
  });
});
