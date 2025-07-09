import { GET } from "app/api/reviews/[id]/get.handler";
import { NextRequest } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { createMockRequest } from "__tests__/utils/test-utils";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
jest.mock("firebase-admin-config", () => {
  const mockDoc = {
    get: jest.fn(),
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
const { mockDoc } = jest.requireMock("firebase-admin-config");

// ==== 테스트 스위트: 개별 리뷰 조회 API 핸들러 ====
describe("GET /api/reviews/[id]", () => {
  const mockReviewId = "test-review-id";

  beforeEach(() => {
    jest.clearAllMocks();
    mockDoc.get.mockClear();
  });

  it("성공적으로 개별 리뷰를 조회하고 200 상태 코드를 반환해야 합니다", async () => {
    // GIVEN: Firestore에 해당 ID의 리뷰 문서가 존재하는 상황
    const mockReviewData = {
      reviewTitle: "Test Review",
      content: "A great movie.",
    };
    mockDoc.get.mockResolvedValue({
      exists: true,
      id: mockReviewId,
      data: () => mockReviewData,
    });

    const request = createMockRequest({ method: "GET" });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest, {
      params: { id: mockReviewId },
    });
    const body = await response.json();

    // THEN: 성공 응답 확인 및 데이터 검증
    expect(response.status).toBe(200);
    expect(body).toEqual({
      id: mockReviewId,
      ...mockReviewData,
    });
    expect(adminFirestore.collection("movie-reviews").doc).toHaveBeenCalledWith(
      mockReviewId,
    );
  });

  it("리뷰를 찾을 수 없으면 404 에러를 반환해야 합니다", async () => {
    // GIVEN: Firestore에 해당 ID의 리뷰 문서가 존재하지 않는 상황
    mockDoc.get.mockResolvedValue({ exists: false });

    const request = createMockRequest({ method: "GET" });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest, {
      params: { id: mockReviewId },
    });
    const body = await response.json();

    // THEN: 404 에러 응답 확인
    expect(response.status).toBe(404);
    expect(body.error).toBe("리뷰를 찾을 수 없습니다.");
  });

  it("리뷰 조회 중 서버 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    // GIVEN: Firestore의 get 함수에서 에러가 발생하는 상황
    mockDoc.get.mockRejectedValue(new Error("DB 조회 오류"));

    const request = createMockRequest({ method: "GET" });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest, {
      params: { id: mockReviewId },
    });
    const body = await response.json();

    // THEN: 500 에러 응답 확인
    expect(response.status).toBe(500);
    expect(body.error).toBe("리뷰 조회에 실패했습니다.");
  });
});
