import { DELETE } from "app/api/comments/[reviewId]/[commentId]/delete.handler";
import { NextRequest } from "next/server";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { createMockRequest } from "__tests__/utils/test-utils";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
jest.mock("lib/auth/verifyToken");
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockCommentDoc = {
  get: jest.fn(),
  delete: jest.fn(),
};
const mockSubCollection = { doc: jest.fn(() => mockCommentDoc) };
const mockMainDoc = { collection: jest.fn(() => mockSubCollection) };

jest.mock("firebase-admin-config", () => ({
  adminFirestore: {
    collection: jest.fn(() => ({ doc: jest.fn(() => mockMainDoc) })),
  },
}));

const mockedVerifyAuthToken = verifyAuthToken as jest.Mock;
const mockedVerifyResourceOwnership = verifyResourceOwnership as jest.Mock;

describe("DELETE /api/comments/[reviewId]/[commentId]", () => {
  const mockReviewId = "test-review-id";
  const mockCommentId = "test-comment-id";
  const mockUid = "test-user-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("성공적으로 댓글을 삭제하고 200 상태 코드를 반환해야 합니다", async () => {
    // GIVEN
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockCommentDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ authorId: mockUid }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });

    const request = createMockRequest({ method: "DELETE" });
    const params = { reviewId: mockReviewId, commentId: mockCommentId };

    // WHEN
    const response = await DELETE(request as NextRequest, { params });
    const body = await response.json();

    // THEN
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(mockCommentDoc.delete).toHaveBeenCalledTimes(1);
  });

  it("댓글을 찾을 수 없으면 404 에러를 반환해야 합니다", async () => {
    // GIVEN
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockCommentDoc.get.mockResolvedValue({ exists: false });

    const request = createMockRequest({ method: "DELETE" });
    const params = { reviewId: mockReviewId, commentId: mockCommentId };

    // WHEN
    const response = await DELETE(request as NextRequest, { params });

    // THEN
    expect(response.status).toBe(404);
  });

  it("리소스 소유자가 아니면 403 에러를 반환해야 합니다", async () => {
    // GIVEN
    mockedVerifyAuthToken.mockResolvedValue({
      success: true,
      uid: "another-uid",
    });
    mockCommentDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ authorId: mockUid }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({
      success: false,
      statusCode: 403,
    });

    const request = createMockRequest({ method: "DELETE" });
    const params = { reviewId: mockReviewId, commentId: mockCommentId };

    // WHEN
    const response = await DELETE(request as NextRequest, { params });

    // THEN
    expect(response.status).toBe(403);
  });

  it("DB 삭제 중 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    // GIVEN
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockCommentDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ authorId: mockUid }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockCommentDoc.delete.mockRejectedValue(new Error("DB Error"));

    const request = createMockRequest({ method: "DELETE" });
    const params = { reviewId: mockReviewId, commentId: mockCommentId };

    // WHEN
    const response = await DELETE(request as NextRequest, { params });

    // THEN
    expect(response.status).toBe(500);
  });
});
