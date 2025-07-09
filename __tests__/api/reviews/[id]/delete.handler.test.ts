import { DELETE } from "app/api/reviews/[id]/delete.handler";
import { NextRequest } from "next/server";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { updateUserActivityLevel } from "lib/users/updateUserActivityLevel";
import { revalidatePath, revalidateTag } from "next/cache";
import { createMockRequest } from "__tests__/utils/test-utils";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
jest.mock("lib/auth/verifyToken");
jest.mock("lib/users/updateUserActivityLevel");
jest.mock("next/cache");
jest.mock("firebase-admin-config", () => {
  const mockBatch = {
    delete: jest.fn(),
    commit: jest.fn(),
  };

  // 각 하위 컬렉션을 개별적으로 모의 처리
  const mockCommentsCollection = {
    get: jest.fn(),
  };
  const mockLikedByCollection = {
    get: jest.fn(),
  };

  const mockDoc = {
    get: jest.fn(),
    collection: jest.fn((name) => {
      if (name === "comments") return mockCommentsCollection;
      if (name === "likedBy") return mockLikedByCollection;
      return mockCommentsCollection; // 기본값
    }),
  };

  const mockCollection = {
    doc: jest.fn(() => mockDoc),
  };

  return {
    adminFirestore: {
      collection: jest.fn(() => mockCollection),
      batch: jest.fn(() => mockBatch),
    },
    mockBatch,
    mockDoc,
    mockCommentsCollection,
    mockLikedByCollection,
  };
});

// TypeScript에서 모킹된 함수의 타입을 명확히 하기 위해 변수에 할당합니다.
const mockedVerifyAuthToken = verifyAuthToken as jest.Mock;
const mockedVerifyResourceOwnership = verifyResourceOwnership as jest.Mock;
const mockedUpdateUserActivityLevel = updateUserActivityLevel as jest.Mock;
const mockedRevalidatePath = revalidatePath as jest.Mock;
const mockedRevalidateTag = revalidateTag as jest.Mock;
const { mockBatch, mockDoc, mockCommentsCollection, mockLikedByCollection } =
  jest.requireMock("firebase-admin-config");

// ==== 테스트 스위트: 리뷰 삭제 API 핸들러 ====
describe("DELETE /api/reviews/[id]", () => {
  const mockUid = "test-user-id";
  const mockReviewId = "test-review-id";

  beforeEach(() => {
    jest.clearAllMocks();
    mockBatch.delete.mockClear();
    mockBatch.commit.mockClear();
    mockDoc.get.mockClear();
    mockCommentsCollection.get.mockClear();
    mockLikedByCollection.get.mockClear();
  });

  it("성공적으로 리뷰를 삭제하고 200 상태 코드를 반환해야 합니다", async () => {
    // GIVEN: 모든 검증이 성공하는 상황
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ user: { uid: mockUid } }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });

    // 댓글과 좋아요 데이터 모의 설정
    mockCommentsCollection.get.mockResolvedValue({
      docs: [{ ref: { path: "comment1" } }, { ref: { path: "comment2" } }],
      forEach: jest.fn((callback) => {
        callback({ ref: { path: "comment1" } });
        callback({ ref: { path: "comment2" } });
      }),
    });

    mockLikedByCollection.get.mockResolvedValue({
      docs: [{ ref: { path: "like1" } }, { ref: { path: "like2" } }],
      forEach: jest.fn((callback) => {
        callback({ ref: { path: "like1" } });
        callback({ ref: { path: "like2" } });
      }),
    });

    mockBatch.commit.mockResolvedValue(undefined);
    mockedUpdateUserActivityLevel.mockResolvedValue("PRO");

    const request = createMockRequest({ method: "DELETE" });

    // WHEN: DELETE 핸들러 호출
    const response = await DELETE(request as NextRequest, {
      params: { id: mockReviewId },
    });
    const body = await response.json();

    // THEN: 성공 응답 확인
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("리뷰가 성공적으로 삭제되었습니다.");

    // Firestore 배치 함수들이 올바르게 호출되었는지 확인
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
    // 1(리뷰) + 2(댓글) + 2(좋아요) = 5번 delete 호출
    expect(mockBatch.delete).toHaveBeenCalledTimes(5);

    // 캐시 관련 함수들이 호출되었는지 확인
    expect(mockedRevalidateTag).toHaveBeenCalledWith("reviews");
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
      params: { id: mockReviewId },
    });
    expect(response.status).toBe(401);
  });

  it("리뷰를 찾을 수 없으면 404 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockDoc.get.mockResolvedValue({ exists: false });
    const request = createMockRequest({ method: "DELETE" });
    const response = await DELETE(request as NextRequest, {
      params: { id: mockReviewId },
    });
    expect(response.status).toBe(404);
  });

  it("리소스 소유자가 아니면 403 에러를 반환해야 합니다", async () => {
    const anotherUid = "another-user-id";
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: anotherUid });
    mockDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ user: { uid: mockUid } }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({
      success: false,
      statusCode: 403,
    });
    const request = createMockRequest({ method: "DELETE" });
    const response = await DELETE(request as NextRequest, {
      params: { id: mockReviewId },
    });
    expect(response.status).toBe(403);
  });

  it("리뷰 삭제 중 서버 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ user: { uid: mockUid } }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockCommentsCollection.get.mockResolvedValue({
      docs: [],
      forEach: jest.fn(),
    });
    mockLikedByCollection.get.mockResolvedValue({
      docs: [],
      forEach: jest.fn(),
    });
    mockBatch.commit.mockRejectedValue(new Error("배치 커밋 오류"));
    const request = createMockRequest({ method: "DELETE" });
    const response = await DELETE(request as NextRequest, {
      params: { id: mockReviewId },
    });
    expect(response.status).toBe(500);
  });
});
