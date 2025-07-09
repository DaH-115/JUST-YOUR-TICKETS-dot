import { POST } from "app/api/comments/[reviewId]/post.handler";
import { NextRequest } from "next/server";
import { adminAuth } from "firebase-admin-config";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { createMockRequest } from "__tests__/utils/test-utils";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
jest.mock("lib/auth/verifyToken");

const mockUserDoc = { get: jest.fn() };
const mockUserCollection = { doc: jest.fn(() => mockUserDoc) };

const mockCommentAdd = jest.fn();
const mockSubCollection = { add: mockCommentAdd };
const mockMainDoc = { collection: jest.fn(() => mockSubCollection) };
const mockReviewsCollection = { doc: jest.fn(() => mockMainDoc) };

jest.mock("firebase-admin-config", () => ({
  adminFirestore: {
    collection: jest.fn((name) => {
      if (name === "users") return mockUserCollection;
      if (name === "movie-reviews") return mockReviewsCollection;
      return { doc: jest.fn().mockReturnThis(), collection: jest.fn() };
    }),
  },
  adminAuth: {
    getUser: jest.fn(),
  },
}));

const mockedVerifyAuthToken = verifyAuthToken as jest.Mock;
const mockedVerifyResourceOwnership = verifyResourceOwnership as jest.Mock;
const mockedGetUser = adminAuth.getUser as jest.Mock;

describe("POST /api/comments/[reviewId]", () => {
  const mockReviewId = "test-review-id";
  const mockUid = "test-user-id";
  const mockContent = "This is a test comment.";
  const mockPostData = { authorId: mockUid, content: mockContent };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("성공적으로 댓글을 생성하고 201 상태 코드를 반환해야 합니다", async () => {
    // GIVEN: 모든 검증 통과, Firestore에 사용자 정보 존재
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockUserDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({
        displayName: "Test User",
        photoKey: "key1",
        activityLevel: "VIP",
      }),
    });
    mockCommentAdd.mockResolvedValue({ id: "new-comment-id" });

    const request = createMockRequest({ method: "POST", body: mockPostData });
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    const body = await response.json();

    // THEN
    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.id).toBe("new-comment-id");

    const addedComment = mockCommentAdd.mock.calls[0][0];
    expect(addedComment.displayName).toBe("Test User");
    expect(addedComment.photoKey).toBe("key1");
    expect(addedComment.activityLevel).toBe("VIP");
  });

  it("Firestore에 사용자 정보가 없을 때 Auth 정보로 대체되어야 합니다", async () => {
    // GIVEN: Firestore users 문서 없음, Auth 정보는 존재
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockUserDoc.get.mockResolvedValue({ exists: false }); // Firestore에는 없음
    mockedGetUser.mockResolvedValue({ displayName: "Auth User" }); // Auth에는 있음

    const request = createMockRequest({ method: "POST", body: mockPostData });
    await POST(request as NextRequest, { params: { reviewId: mockReviewId } });

    // THEN
    const addedComment = mockCommentAdd.mock.calls[0][0];
    expect(addedComment.displayName).toBe("Auth User");
  });

  it("필수 필드가 누락되면 400 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    const request = createMockRequest({
      method: "POST",
      body: { authorId: mockUid },
    }); // content 누락
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    expect(response.status).toBe(400);
  });

  it("리소스 소유자가 아니면 403 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({
      success: true,
      uid: "another-uid",
    });
    mockedVerifyResourceOwnership.mockReturnValue({
      success: false,
      error: "Forbidden",
      statusCode: 403,
    });
    const request = createMockRequest({ method: "POST", body: mockPostData });
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    expect(response.status).toBe(403);
  });

  it("댓글 생성 중 DB 오류가 발생하면 500 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockUserDoc.get.mockResolvedValue({ exists: true, data: () => ({}) });
    mockCommentAdd.mockRejectedValue(new Error("DB Error"));

    const request = createMockRequest({ method: "POST", body: mockPostData });
    const response = await POST(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    expect(response.status).toBe(500);
  });
});
