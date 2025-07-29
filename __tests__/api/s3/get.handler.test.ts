import { GET } from "app/api/s3/get.handler";
import { createMockRequest } from "__tests__/utils/test-utils";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyAuthToken } from "lib/auth/verifyToken";

jest.mock("@aws-sdk/s3-request-presigner", () => ({ getSignedUrl: jest.fn() }));
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn(() => ({})),
  GetObjectCommand: jest.fn((args) => ({ ...args })),
}));
jest.mock("lib/auth/verifyToken", () => ({ verifyAuthToken: jest.fn() }));

describe("GET /api/s3", () => {
  const mockSignedUrl =
    "https://s3.amazonaws.com/mock-bucket/mock-presigned-url";
  const mockKey = "profile-img/test-user-123/1234567890_test.jpg";
  const mockUserId = "test-user-123";

  beforeEach(() => {
    // 각 테스트 전 mock 및 상태 초기화
    jest.clearAllMocks();
    (getSignedUrl as jest.Mock).mockResolvedValue(mockSignedUrl);
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      success: true,
      uid: mockUserId,
    });
  });

  test("성공: 유효한 요청 시 presigned URL을 반환해야 함", async () => {
    // 정상적으로 인증, key 파라미터, S3 presigned URL 생성까지 모두 성공하는 경우
    const req = createMockRequest({
      method: "GET",
      url: `http://localhost:3000/api/s3?key=${encodeURIComponent(mockKey)}`,
      headers: { authorization: "Bearer mock-token" },
    });
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.url).toBe(mockSignedUrl);
    expect(getSignedUrl).toHaveBeenCalledTimes(1);
  });

  test("실패: key 파라미터가 없는 경우 400 에러를 반환해야 함", async () => {
    // key 파라미터가 없을 때 400 반환
    const req = createMockRequest({
      method: "GET",
      url: "http://localhost:3000/api/s3",
      headers: { authorization: "Bearer mock-token" },
    });
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toBe(true);
    expect(body.message).toBe("key 파라미터가 필요합니다.");
    expect(getSignedUrl).not.toHaveBeenCalled();
  });

  test("실패: 인증되지 않은 요청 시 401 에러를 반환해야 함", async () => {
    // 인증 실패 시 401 반환
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      success: false,
      error: "로그인이 필요합니다.",
      statusCode: 401,
    });
    const req = createMockRequest({
      method: "GET",
      url: `http://localhost:3000/api/s3?key=${encodeURIComponent(mockKey)}`,
    });
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.error).toBe(true);
    expect(body.message).toBe("인증이 필요합니다.");
    expect(getSignedUrl).not.toHaveBeenCalled();
  });

  test("실패: getSignedUrl에서 에러 발생 시 500 에러를 반환해야 함", async () => {
    // getSignedUrl 함수에서 에러 발생 시 500 반환
    const errorMessage = "S3 is down";
    (getSignedUrl as jest.Mock).mockRejectedValue(new Error(errorMessage));
    const req = createMockRequest({
      method: "GET",
      url: `http://localhost:3000/api/s3?key=${encodeURIComponent(mockKey)}`,
      headers: { authorization: "Bearer mock-token" },
    });
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.error).toBe(true);
    expect(body.message).toBe(errorMessage);
    expect(getSignedUrl).toHaveBeenCalledTimes(1);
  });
});
