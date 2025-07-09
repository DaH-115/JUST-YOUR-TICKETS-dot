import { PUT } from "app/api/reviews/[id]/put.handler";
import { NextRequest } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { revalidatePath, revalidateTag } from "next/cache";
import { createMockRequest } from "__tests__/utils/test-utils";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
jest.mock("lib/auth/verifyToken");
jest.mock("next/cache");
jest.mock("firebase-admin-config", () => {
  const mockDoc = {
    get: jest.fn(),
    update: jest.fn(),
  };
  const mockCollection = {
    doc: jest.fn(() => mockDoc),
  };
  return {
    adminFirestore: {
      collection: jest.fn(() => mockCollection),
    },
    mockDoc, // 테스트에서 직접 접근하기 위해 export
  };
});

// TypeScript에서 모킹된 함수의 타입을 명확히 하기 위해 변수에 할당합니다.
const mockedVerifyAuthToken = verifyAuthToken as jest.Mock;
const mockedVerifyResourceOwnership = verifyResourceOwnership as jest.Mock;
const mockedRevalidatePath = revalidatePath as jest.Mock;
const mockedRevalidateTag = revalidateTag as jest.Mock;
const { mockDoc } = jest.requireMock("firebase-admin-config");

// ==== 테스트 스위트: 리뷰 수정 API 핸들러 ====
describe("PUT /api/reviews/[id]", () => {
  const mockUid = "test-user-id";
  const mockReviewId = "test-review-id";
  const mockUpdateData = {
    reviewTitle: "Updated Title",
    reviewContent: "Updated content.",
    rating: 4,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDoc.get.mockClear();
    mockDoc.update.mockClear();
  });

  it("성공적으로 리뷰를 수정하고 200 상태 코드를 반환해야 합니다", async () => {
    // GIVEN: 모든 검증이 성공하는 상황
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ user: { uid: mockUid } }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });

    const request = createMockRequest({ method: "PUT", body: mockUpdateData });

    // WHEN: PUT 핸들러 호출
    const response = await PUT(request as NextRequest, {
      params: { id: mockReviewId },
    });
    const body = await response.json();

    // THEN: 성공 응답 확인
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("리뷰가 성공적으로 수정되었습니다.");

    // Firestore update 함수가 올바른 데이터로 호출되었는지 확인
    expect(mockDoc.update).toHaveBeenCalledTimes(1);
    expect(mockDoc.update).toHaveBeenCalledWith(
      expect.objectContaining({
        "review.reviewTitle": mockUpdateData.reviewTitle,
        "review.reviewContent": mockUpdateData.reviewContent,
        "review.rating": mockUpdateData.rating,
      }),
    );

    // 캐시 관련 함수들이 호출되었는지 확인
    expect(mockedRevalidateTag).toHaveBeenCalledWith("reviews");
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/ticket-list");
  });

  it("요청 본문에 필수 필드가 누락되면 400 에러를 반환해야 합니다", async () => {
    // GIVEN: 인증은 성공했으나, 요청 본문이 비어있는 상황
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    const incompleteData = { reviewTitle: "Incomplete" }; // rating, reviewContent 누락

    const request = createMockRequest({ method: "PUT", body: incompleteData });

    // WHEN: PUT 핸들러 호출
    const response = await PUT(request as NextRequest, {
      params: { id: mockReviewId },
    });
    const body = await response.json();

    // THEN: 400 에러 응답 확인
    expect(response.status).toBe(400);
    expect(body.error).toBe("reviewTitle, reviewContent, rating이 필요합니다.");
  });

  // 인증 실패, 문서 없음, 권한 없음, 서버 오류에 대한 테스트 케이스는
  // DELETE 핸들러의 테스트와 매우 유사하므로 동일한 패턴으로 작성합니다.

  it("인증에 실패하면 401 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({
      success: false,
      error: "인증 실패",
      statusCode: 401,
    });
    const request = createMockRequest({ method: "PUT", body: mockUpdateData });
    const response = await PUT(request as NextRequest, {
      params: { id: mockReviewId },
    });
    expect(response.status).toBe(401);
  });

  it("리뷰를 찾을 수 없으면 404 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockDoc.get.mockResolvedValue({ exists: false });
    const request = createMockRequest({ method: "PUT", body: mockUpdateData });
    const response = await PUT(request as NextRequest, {
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
    const request = createMockRequest({ method: "PUT", body: mockUpdateData });
    const response = await PUT(request as NextRequest, {
      params: { id: mockReviewId },
    });
    expect(response.status).toBe(403);
  });

  it("리뷰 수정 중 서버 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ user: { uid: mockUid } }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockDoc.update.mockRejectedValue(new Error("DB 업데이트 오류"));
    const request = createMockRequest({ method: "PUT", body: mockUpdateData });
    const response = await PUT(request as NextRequest, {
      params: { id: mockReviewId },
    });
    expect(response.status).toBe(500);
  });
});
