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
  const mockDoc = {
    get: jest.fn(),
    delete: jest.fn(),
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
const mockedUpdateUserActivityLevel = updateUserActivityLevel as jest.Mock;
const mockedRevalidatePath = revalidatePath as jest.Mock;
const mockedRevalidateTag = revalidateTag as jest.Mock;
// firebase-admin-config 모킹에서 mockDoc을 가져옵니다.
const { mockDoc } = jest.requireMock("firebase-admin-config");

// ==== 테스트 스위트: 리뷰 삭제 API 핸들러 ====
describe("DELETE /api/reviews/[id]", () => {
  const mockUid = "test-user-id";
  const mockReviewId = "test-review-id";

  // 각 테스트 전에 모킹 함수들 초기화
  beforeEach(() => {
    jest.clearAllMocks();
    // mockDoc의 get, delete 함수도 개별적으로 초기화
    mockDoc.get.mockClear();
    mockDoc.delete.mockClear();
  });

  it("성공적으로 리뷰를 삭제하고 200 상태 코드를 반환해야 합니다", async () => {
    // GIVEN: 인증, 문서 존재, 소유권 검증이 모두 성공하는 상황
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ user: { uid: mockUid } }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });

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

    // 올바른 함수들이 호출되었는지 확인
    expect(mockDoc.delete).toHaveBeenCalledTimes(1);
    expect(mockedUpdateUserActivityLevel).toHaveBeenCalledWith(mockUid);
    expect(mockedRevalidateTag).toHaveBeenCalledWith("reviews");
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/ticket-list");
  });

  it("인증에 실패하면 401 에러를 반환해야 합니다", async () => {
    // GIVEN: 인증 실패
    mockedVerifyAuthToken.mockResolvedValue({
      success: false,
      error: "인증 실패",
      statusCode: 401,
    });

    const request = createMockRequest({ method: "DELETE" });

    // WHEN: DELETE 핸들러 호출
    const response = await DELETE(request as NextRequest, {
      params: { id: mockReviewId },
    });
    const body = await response.json();

    // THEN: 401 에러 응답 확인
    expect(response.status).toBe(401);
    expect(body.error).toBe("인증 실패");
  });

  it("리뷰를 찾을 수 없으면 404 에러를 반환해야 합니다", async () => {
    // GIVEN: 인증은 성공했지만, 리뷰 문서가 존재하지 않는 상황
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockDoc.get.mockResolvedValue({ exists: false });

    const request = createMockRequest({ method: "DELETE" });

    // WHEN: DELETE 핸들러 호출
    const response = await DELETE(request as NextRequest, {
      params: { id: mockReviewId },
    });
    const body = await response.json();

    // THEN: 404 에러 응답 확인
    expect(response.status).toBe(404);
    expect(body.error).toBe("리뷰를 찾을 수 없습니다.");
  });

  it("리소스 소유자가 아니면 403 에러를 반환해야 합니다", async () => {
    // GIVEN: 인증은 성공했지만, 리소스 소유자가 아닌 상황
    const anotherUid = "another-user-id";
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: anotherUid });
    mockDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ user: { uid: mockUid } }), // 리뷰 작성자는 mockUid
    });
    mockedVerifyResourceOwnership.mockReturnValue({
      success: false,
      error: "권한 없음",
      statusCode: 403,
    });

    const request = createMockRequest({ method: "DELETE" });

    // WHEN: DELETE 핸들러 호출
    const response = await DELETE(request as NextRequest, {
      params: { id: mockReviewId },
    });
    const body = await response.json();

    // THEN: 403 에러 응답 확인
    expect(response.status).toBe(403);
    expect(body.error).toBe("권한 없음");
    expect(mockedVerifyResourceOwnership).toHaveBeenCalledWith(
      anotherUid,
      mockUid,
    );
  });

  it("리뷰 삭제 중 서버 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    // GIVEN: Firestore의 delete 함수에서 에러가 발생하는 상황
    mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
    mockDoc.get.mockResolvedValue({
      exists: true,
      data: () => ({ user: { uid: mockUid } }),
    });
    mockedVerifyResourceOwnership.mockReturnValue({ success: true });
    mockDoc.delete.mockRejectedValue(new Error("DB 삭제 오류"));

    const request = createMockRequest({ method: "DELETE" });

    // WHEN: DELETE 핸들러 호출
    const response = await DELETE(request as NextRequest, {
      params: { id: mockReviewId },
    });
    const body = await response.json();

    // THEN: 500 에러 응답 확인
    expect(response.status).toBe(500);
    expect(body.error).toBe("리뷰 삭제에 실패했습니다.");
  });
});
