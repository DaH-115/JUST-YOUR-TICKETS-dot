import { GET } from "app/api/reviews/[id]/get.handler";
import { NextRequest } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { createMockRequest } from "__tests__/utils/test-utils";

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
    mockDoc,
  };
});

const { mockDoc } = jest.requireMock("firebase-admin-config");

describe("GET /api/reviews/[id]", () => {
  const mockReviewId = "test-review-id";

  beforeEach(() => {
    // 각 테스트 전 mock 및 상태 초기화
    jest.clearAllMocks();
    mockDoc.get.mockClear();
  });

  test("성공적으로 개별 리뷰를 조회하고 200 상태 코드를 반환해야 합니다", async () => {
    // 정상적으로 Firestore에 해당 ID의 리뷰 문서가 존재하는 경우
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
    const response = await GET(request as NextRequest, { params: { id: mockReviewId } });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({ id: mockReviewId, ...mockReviewData });
    expect(adminFirestore.collection("movie-reviews").doc).toHaveBeenCalledWith(mockReviewId);
  });

  test("리뷰를 찾을 수 없으면 404 에러를 반환해야 합니다", async () => {
    // 리뷰 문서가 존재하지 않을 때 404 반환
    mockDoc.get.mockResolvedValue({ exists: false });
    const request = createMockRequest({ method: "GET" });
    const response = await GET(request as NextRequest, { params: { id: mockReviewId } });
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.error).toBe("리뷰를 찾을 수 없습니다.");
  });

  test("리뷰 조회 중 서버 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    // Firestore의 get 함수에서 에러가 발생하는 경우 500 반환
    mockDoc.get.mockRejectedValue(new Error("DB 조회 오류"));
    const request = createMockRequest({ method: "GET" });
    const response = await GET(request as NextRequest, { params: { id: mockReviewId } });
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.error).toBe("리뷰 조회에 실패했습니다.");
  });
});
