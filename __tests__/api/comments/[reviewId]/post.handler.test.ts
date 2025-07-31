import { POST } from "app/api/comments/[reviewId]/post.handler";
import { NextRequest } from "next/server";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { updateUserActivityLevel } from "lib/users/updateUserActivityLevel";
import { revalidatePath } from "next/cache";
import { createMockRequest } from "__tests__/utils/test-utils";

jest.mock("lib/auth/verifyToken");
jest.mock("lib/users/updateUserActivityLevel");
jest.mock("next/cache");
jest.mock("firebase-admin-config", () => {
  const mockNewCommentRef = { id: "new-comment-id" };
  const mockTransaction = { get: jest.fn(), set: jest.fn(), update: jest.fn() };
  const mockCommentCollection = { doc: jest.fn(() => mockNewCommentRef) };
  const mockReviewDoc = { collection: jest.fn(() => mockCommentCollection) };
  const mockReviewCollection = { doc: jest.fn(() => mockReviewDoc) };
  const mockUserDoc = { get: jest.fn() };
  const mockUserCollection = { doc: jest.fn(() => mockUserDoc) };
  return {
    adminFirestore: {
      collection: jest.fn((name) => {
        if (name === "movie-reviews") return mockReviewCollection;
        if (name === "users") return mockUserCollection;
        return mockReviewCollection;
      }),
      runTransaction: jest.fn().mockImplementation(async (callback) => {
        await callback(mockTransaction);
        return mockNewCommentRef;
      }),
    },
    adminAuth: { getUser: jest.fn() },
    mockTransaction,
    mockNewCommentRef,
    mockUserDoc,
  };
});

const mockedVerifyAuthToken = verifyAuthToken as jest.Mock;
const mockedVerifyResourceOwnership = verifyResourceOwnership as jest.Mock;
const mockedUpdateUserActivityLevel = updateUserActivityLevel as jest.Mock;
const mockedRevalidatePath = revalidatePath as jest.Mock;
const { mockTransaction, mockUserDoc } = jest.requireMock(
  "firebase-admin-config",
);

describe("POST /api/comments/[reviewId]", () => {
  const mockUid = "test-user-id";
  const mockReviewId = "test-review-id";
  const mockCommentData = { authorId: "test-user-id", content: "Great movie!" };

  beforeEach(() => {
    // 각 테스트 전 mock 및 상태 초기화
    jest.clearAllMocks();
    mockTransaction.get.mockClear();
    mockTransaction.set.mockClear();
    mockTransaction.update.mockClear();
    mockUserDoc.get.mockClear();
  });

  test("성공적으로 댓글을 생성하고 201 상태 코드를 반환해야 합니다", async () => {
    // 정상적으로 인증, 소유권, Firestore 트랜잭션, 등급 업데이트, 캐시 무효화까지 모두 성공하는 경우
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockTransaction.get.mockResolvedValue({ exists: true });
    mockUserDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({
        displayName: "Test User",
        photoKey: null,
        activityLevel: "PRO",
      }),
    });
    mockedUpdateUserActivityLevel.mockResolvedValue("PRO");
    const request = createMockRequest({
      method: "POST",
      body: mockCommentData,
    });
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.id).toBe("new-comment-id");
    expect(body.message).toBe("댓글이 성공적으로 등록되었습니다.");
    expect(mockTransaction.get).toHaveBeenCalledTimes(1);
    expect(mockTransaction.set).toHaveBeenCalledTimes(1);
    expect(mockTransaction.update).toHaveBeenCalledTimes(1);
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/ticket-list");
    expect(mockedUpdateUserActivityLevel).toHaveBeenCalledWith(mockUid);
  });

  test("요청 본문에 필수 필드가 누락되면 400 에러를 반환해야 합니다", async () => {
    // authorId, content 중 하나라도 누락 시 400 반환
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    const incompleteData = { authorId: "test-user-id" };
    const request = createMockRequest({ method: "POST", body: incompleteData });
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toBe("authorId와 content가 필요합니다.");
  });

  test("인증에 실패하면 401 에러를 반환해야 합니다", async () => {
    // 인증 실패 시 401 반환
    mockedVerifyAuthToken.mockResolvedValue({
      success: false,
      error: "인증 실패",
      statusCode: 401,
    });
    const request = createMockRequest({
      method: "POST",
      body: mockCommentData,
    });
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    expect(response.status).toBe(401);
  });

  test("리뷰를 찾을 수 없으면 404 에러를 반환해야 합니다", async () => {
    // 리뷰 문서가 존재하지 않을 때 500 반환(트랜잭션 내부 에러)
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockTransaction.get.mockResolvedValue({ exists: false });
    const request = createMockRequest({
      method: "POST",
      body: mockCommentData,
    });
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    expect(response.status).toBe(500);
  });

  test("리소스 소유자가 아니면 403 에러를 반환해야 합니다", async () => {
    // 인증된 사용자와 리뷰 작성자의 UID가 다를 때 403 반환
    const anotherUid = "another-user-id";
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: anotherUid });
    mockedVerifyResourceOwnership.mockReturnValue({
      success: false,
      statusCode: 403,
    });
    const request = createMockRequest({
      method: "POST",
      body: mockCommentData,
    });
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    expect(response.status).toBe(403);
  });
});
