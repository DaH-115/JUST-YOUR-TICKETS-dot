import { POST } from "app/api/s3/post.handler";
import { createMockRequest } from "__tests__/utils/test-utils";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyAuthToken } from "lib/auth/verifyToken";

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(),
}));

jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn(() => ({})),
  PutObjectCommand: jest.fn((args) => ({ ...args })),
}));

jest.mock("lib/auth/verifyToken", () => ({
  verifyAuthToken: jest.fn(),
}));

describe("POST /api/s3", () => {
  const mockSignedUrl =
    "https://s3.amazonaws.com/mock-bucket/mock-presigned-url";
  const mockFilename = "test-image.png";
  const mockContentType = "image/png";
  const mockUserId = "test-user-123";
  const mockSize = 1024 * 1024; // 1MB

  beforeEach(() => {
    jest.clearAllMocks();
    (getSignedUrl as jest.Mock).mockResolvedValue(mockSignedUrl);
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      success: true,
      uid: mockUserId,
    });
  });

  test("성공: 유효한 요청 시 presigned URL과 key를 반환해야 함", async () => {
    const req = createMockRequest({
      method: "POST",
      headers: {
        authorization: "Bearer mock-token",
      },
      body: {
        filename: mockFilename,
        contentType: mockContentType,
        size: mockSize,
      },
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.url).toBe(mockSignedUrl);
    expect(body.key).toMatch(
      new RegExp(`^profile-img/${mockUserId}/\\d+_${mockFilename}$`),
    );

    expect(getSignedUrl).toHaveBeenCalledTimes(1);
    const getSignedUrlCall = (getSignedUrl as jest.Mock).mock.calls[0];
    const command = getSignedUrlCall[1];

    expect(command.Bucket).toBe(process.env.AWS_S3_BUCKET);
    expect(command.Key).toBe(body.key);
    expect(command.ContentType).toBe(mockContentType);
  });

  test("실패: 필수 파라미터(filename)가 없는 경우 400 에러를 반환해야 함", async () => {
    const req = createMockRequest({
      method: "POST",
      headers: {
        authorization: "Bearer mock-token",
      },
      body: {
        contentType: mockContentType,
        size: mockSize,
      },
    });
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("filename, contentType, size가 모두 필요합니다.");
    expect(getSignedUrl).not.toHaveBeenCalled();
  });

  test("실패: getSignedUrl에서 에러 발생 시 500 에러를 반환해야 함", async () => {
    const errorMessage = "S3 is down";
    (getSignedUrl as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const req = createMockRequest({
      method: "POST",
      headers: {
        authorization: "Bearer mock-token",
      },
      body: {
        filename: mockFilename,
        contentType: mockContentType,
        size: mockSize,
      },
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe(errorMessage);
    expect(getSignedUrl).toHaveBeenCalledTimes(1);
  });

  test("실패: 인증되지 않은 요청 시 401 에러를 반환해야 함", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      success: false,
      error: "로그인이 필요합니다.",
      statusCode: 401,
    });

    const req = createMockRequest({
      method: "POST",
      body: {
        filename: mockFilename,
        contentType: mockContentType,
        size: mockSize,
      },
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("로그인이 필요합니다.");
    expect(getSignedUrl).not.toHaveBeenCalled();
  });

  test("실패: 허용되지 않는 파일 타입인 경우 400 에러를 반환해야 함", async () => {
    const req = createMockRequest({
      method: "POST",
      headers: {
        authorization: "Bearer mock-token",
      },
      body: {
        filename: "test.txt",
        contentType: "text/plain",
        size: mockSize,
      },
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("허용되지 않는 파일 타입입니다.");
    expect(getSignedUrl).not.toHaveBeenCalled();
  });

  test("실패: 파일 크기가 너무 큰 경우 400 에러를 반환해야 함", async () => {
    const req = createMockRequest({
      method: "POST",
      headers: {
        authorization: "Bearer mock-token",
      },
      body: {
        filename: mockFilename,
        contentType: mockContentType,
        size: 6 * 1024 * 1024, // 6MB (5MB 초과)
      },
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("파일 크기는 5MB를 초과할 수 없습니다.");
    expect(getSignedUrl).not.toHaveBeenCalled();
  });
});
