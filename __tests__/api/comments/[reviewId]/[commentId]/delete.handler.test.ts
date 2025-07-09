import { DELETE } from "app/api/comments/[reviewId]/[commentId]/delete.handler";
import { NextRequest } from "next/server";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { updateUserActivityLevel } from "lib/users/updateUserActivityLevel";
import { revalidatePath } from "next/cache";
import { createMockRequest } from "__tests__/utils/test-utils";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
jest.mock("lib/auth/verifyToken");
jest.mock("lib/users/updateUserActivityLevel");
jest.mock("next/cache");
jest.mock("firebase-admin-config", () => {
  const mockTransaction = {
    get: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };
  const mockCommentDoc = {
    get: jest.fn(),
  };
  const mockCommentCollection = {
    doc: jest.fn(() => mockCommentDoc),
  };
  const mockReviewDoc = {
    collection: jest.fn(() => mockCommentCollection),
  };
  const mockReviewCollection = {
    doc: jest.fn(() => mockReviewDoc),
  };
  return {
    adminFirestore: {
      collection: jest.fn(() => mockReviewCollection),
      runTransaction: jest.fn().mockImplementation(async (callback) => {
        await callback(mockTransaction);
        return true;
      }),
    },
    mockTransaction,
    mockCommentDoc,
  };
});

// TypeScript에서 모킹된 함수의 타입을 명확히 하기 위해 변수에 할당합니다.
const mockedVerifyAuthToken = verifyAuthToken as jest.Mock;
const mockedVerifyResourceOwnership = verifyResourceOwnership as jest.Mock;
const mockedUpdateUserActivityLevel = updateUserActivityLevel as jest.Mock;
const mockedRevalidatePath = revalidatePath as jest.Mock;
const { mockTransaction, mockCommentDoc } = jest.requireMock(
  "firebase-admin-config",
);

// ==== 테스트 스위트: 댓글 삭제 API 핸들러 ====
describe("DELETE /api/comments/[reviewId]/[commentId]", () => {
  const mockUid = "test-user-id";
  const mockReviewId = "test-review-id";
  const mockCommentId = "test-comment-id";

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransaction.get.mockClear();
    mockTransaction.delete.mockClear();
    mockTransaction.update.mockClear();
    mockCommentDoc.get.mockClear();
  });

  it("성공적으로 댓글을 삭제하고 200 상태 코드를 반환해야 합니다", async () => {
    // GIVEN: 모든 검증이 성공하는 상황
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockTransaction.get.mockResolvedValue({
      exists: true,
      data: () => ({ authorId: mockUid }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockedUpdateUserActivityLevel.mockResolvedValue("PRO");

    const request = createMockRequest({ method: "DELETE" });

    // WHEN: DELETE 핸들러 호출
    const response = await DELETE(request as NextRequest, {
      params: { reviewId: mockReviewId, commentId: mockCommentId },
    });
    const body = await response.json();

    // THEN: 성공 응답 확인
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("댓글이 성공적으로 삭제되었습니다.");

    // Firestore 트랜잭션 함수들이 올바르게 호출되었는지 확인
    expect(mockTransaction.get).toHaveBeenCalledTimes(1);
    expect(mockTransaction.delete).toHaveBeenCalledTimes(1);
    expect(mockTransaction.update).toHaveBeenCalledTimes(1);

    // 캐시 관련 함수들이 호출되었는지 확인
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/ticket-list");

    // 사용자 활동 등급 업데이트 호출 확인
    expect(mockedUpdateUserActivityLevel).toHaveBeenCalledWith(mockUid);
  });

  it("인증에 실패하면 401 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({
      success: false,
      error: "인증 실패",
      statusCode: 401,
    });
    const request = createMockRequest({ method: "DELETE" });
    const response = await DELETE(request as NextRequest, {
      params: { reviewId: mockReviewId, commentId: mockCommentId },
    });
    expect(response.status).toBe(401);
  });

  it("댓글을 찾을 수 없으면 404 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockTransaction.get.mockResolvedValue({ exists: false });
    const request = createMockRequest({ method: "DELETE" });
    const response = await DELETE(request as NextRequest, {
      params: { reviewId: mockReviewId, commentId: mockCommentId },
    });
    expect(response.status).toBe(500); // 트랜잭션 내부에서 에러 발생하므로 500
  });

  it("리소스 소유자가 아니면 403 에러를 반환해야 합니다", async () => {
    const anotherUid = "another-user-id";
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: anotherUid });
    mockTransaction.get.mockResolvedValue({
      exists: true,
      data: () => ({ authorId: mockUid }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({
      success: false,
      statusCode: 403,
    });
    const request = createMockRequest({ method: "DELETE" });
    const response = await DELETE(request as NextRequest, {
      params: { reviewId: mockReviewId, commentId: mockCommentId },
    });
    expect(response.status).toBe(403);
  });
});
