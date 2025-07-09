import { GET } from "app/api/reviews/liked/route";
import { fetchLikedReviewsPaginated } from "lib/reviews/fetchLikedReviewsPaginated";
import { createMockRequest } from "__tests__/utils/test-utils";
import { NextRequest } from "next/server";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
jest.mock("lib/reviews/fetchLikedReviewsPaginated");

// TypeScript에서 모킹된 함수의 타입을 명확히 하기 위해 변수에 할당합니다.
const mockedFetchLikedReviewsPaginated =
  fetchLikedReviewsPaginated as jest.Mock;

// ==== 테스트 스위트: '좋아요'한 리뷰 조회 API 핸들러 ====
describe("GET /api/reviews/liked", () => {
  beforeEach(() => {
    mockedFetchLikedReviewsPaginated.mockClear();
  });

  it("성공적으로 '좋아요'한 리뷰 목록을 조회하고 200 상태 코드를 반환해야 합니다", async () => {
    // GIVEN: fetchLikedReviewsPaginated 함수가 성공적으로 데이터를 반환하는 상황
    const mockResult = { data: [{ id: "liked-review-1" }], hasMore: false };
    mockedFetchLikedReviewsPaginated.mockResolvedValue(mockResult);

    const uid = "test-user-id";
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/liked?uid=${uid}&page=1&pageSize=10`,
    });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest);
    const body = await response.json();

    // THEN: 성공 응답 확인 및 데이터 검증
    expect(response.status).toBe(200);
    expect(body).toEqual(mockResult);
    expect(mockedFetchLikedReviewsPaginated).toHaveBeenCalledWith({
      uid,
      page: 1,
      pageSize: 10,
      search: "",
    });
  });

  it("uid 쿼리 파라미터가 없으면 400 에러를 반환해야 합니다", async () => {
    // GIVEN: uid가 없는 요청
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/liked`,
    });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest);
    const body = await response.json();

    // THEN: 400 에러 응답 확인
    expect(response.status).toBe(400);
    expect(body.error).toBe("uid 쿼리 파라미터를 반드시 넘겨주세요");
  });

  it("데이터 조회 중 서버 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    // GIVEN: fetchLikedReviewsPaginated 함수에서 에러가 발생하는 상황
    const errorMessage = "DB 조회 오류";
    mockedFetchLikedReviewsPaginated.mockRejectedValue(new Error(errorMessage));
    const uid = "test-user-id";
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/liked?uid=${uid}`,
    });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest);
    const body = await response.json();

    // THEN: 500 에러 응답 확인
    expect(response.status).toBe(500);
    expect(body.error).toBe(errorMessage);
  });

  it("search 파라미터가 포함된 요청을 올바르게 처리해야 합니다", async () => {
    // GIVEN: search 파라미터가 포함된 요청
    const mockResult = { data: [], hasMore: false };
    mockedFetchLikedReviewsPaginated.mockResolvedValue(mockResult);
    const uid = "test-user-id";
    const searchTerm = "Inception";
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/liked?uid=${uid}&search=${searchTerm}`,
    });

    // WHEN: GET 핸들러 호출
    await GET(request as NextRequest);

    // THEN: fetchLikedReviewsPaginated 함수가 search 파라미터와 함께 호출됨
    expect(mockedFetchLikedReviewsPaginated).toHaveBeenCalledWith({
      uid,
      page: 1,
      pageSize: 10,
      search: searchTerm,
    });
  });
});
