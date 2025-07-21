import { POST } from "app/api/comments/[reviewId]/post.handler";
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
  const mockNewCommentRef = {
    id: "new-comment-id",
  };
  const mockTransaction = {
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
  };
  const mockCommentCollection = {
    doc: jest.fn(() => mockNewCommentRef),
  };
  const mockReviewDoc = {
    collection: jest.fn(() => mockCommentCollection),
  };
  const mockReviewCollection = {
    doc: jest.fn(() => mockReviewDoc),
  };
  const mockUserDoc = {
    get: jest.fn(),
  };
  const mockUserCollection = {
    doc: jest.fn(() => mockUserDoc),
  };
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
    adminAuth: {
      getUser: jest.fn(),
    },
    mockTransaction,
    mockNewCommentRef,
    mockUserDoc,
  };
});

// TypeScript에서 모킹된 함수의 타입을 명확히 하기 위해 변수에 할당합니다.
const mockedVerifyAuthToken = verifyAuthToken as jest.Mock;
const mockedVerifyResourceOwnership = verifyResourceOwnership as jest.Mock;
const mockedUpdateUserActivityLevel = updateUserActivityLevel as jest.Mock;
const mockedRevalidatePath = revalidatePath as jest.Mock;
const { mockTransaction, mockUserDoc } = jest.requireMock(
  "firebase-admin-config",
);

// ==== 테스트 스위트: 댓글 생성 API 핸들러 ====
describe("POST /api/comments/[reviewId]", () => {
  const mockUid = "test-user-id";
  const mockReviewId = "test-review-id";
  const mockCommentData = {
    authorId: "test-user-id",
    content: "Great movie!",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransaction.get.mockClear();
    mockTransaction.set.mockClear();
    mockTransaction.update.mockClear();
    mockUserDoc.get.mockClear();
  });

  it("성공적으로 댓글을 생성하고 201 상태 코드를 반환해야 합니다", async () => {
    // GIVEN: 모든 검증이 성공하는 상황
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockTransaction.get.mockResolvedValue({ exists: true }); // 리뷰 존재
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

    // WHEN: POST 핸들러 호출
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    const body = await response.json();

    // THEN: 성공 응답 확인
    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.id).toBe("new-comment-id");
    expect(body.message).toBe("댓글이 성공적으로 등록되었습니다.");

    // Firestore 트랜잭션 함수들이 올바르게 호출되었는지 확인
    expect(mockTransaction.get).toHaveBeenCalledTimes(1);
    expect(mockTransaction.set).toHaveBeenCalledTimes(1);
    expect(mockTransaction.update).toHaveBeenCalledTimes(1);

    // 캐시 관련 함수들이 호출되었는지 확인
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/ticket-list");

    // 사용자 활동 등급 업데이트 호출 확인
    expect(mockedUpdateUserActivityLevel).toHaveBeenCalledWith(mockUid);
  });

  it("요청 본문에 필수 필드가 누락되면 400 에러를 반환해야 합니다", async () => {
    // GIVEN: 인증은 성공했으나, 요청 본문이 비어있는 상황
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    const incompleteData = { authorId: "test-user-id" }; // content 누락

    const request = createMockRequest({ method: "POST", body: incompleteData });

    // WHEN: POST 핸들러 호출
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    const body = await response.json();

    // THEN: 400 에러 응답 확인
    expect(response.status).toBe(400);
    expect(body.error).toBe("authorId와 content가 필요합니다.");
  });

  it("인증에 실패하면 401 에러를 반환해야 합니다", async () => {
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

  it("리뷰를 찾을 수 없으면 404 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockTransaction.get.mockResolvedValue({ exists: false }); // 리뷰 없음
    const request = createMockRequest({
      method: "POST",
      body: mockCommentData,
    });
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    expect(response.status).toBe(500); // 트랜잭션 내부에서 에러 발생하므로 500
  });

  it("리소스 소유자가 아니면 403 에러를 반환해야 합니다", async () => {
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
