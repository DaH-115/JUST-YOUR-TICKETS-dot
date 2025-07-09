import { GET } from "app/api/reviews/search/route";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";
import { createMockRequest } from "__tests__/utils/test-utils";
import { NextRequest } from "next/server";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
jest.mock("lib/reviews/fetchReviewsPaginated");

// TypeScript에서 모킹된 함수의 타입을 명확히 하기 위해 변수에 할당합니다.
const mockedFetchReviewsPaginated = fetchReviewsPaginated as jest.Mock;

// ==== 테스트 스위트: 리뷰 검색 API 핸들러 ====
describe("GET /api/reviews/search", () => {
  beforeEach(() => {
    mockedFetchReviewsPaginated.mockClear();
  });

  it("성공적으로 리뷰를 검색하고 200 상태 코드를 반환해야 합니다", async () => {
    // GIVEN: 검색어가 있고, fetch 함수가 성공적으로 데이터를 반환하는 상황
    const mockResult = { data: [{ id: "searched-review-1" }], hasMore: false };
    mockedFetchReviewsPaginated.mockResolvedValue(mockResult);

    const searchTerm = "Dune";
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/search?search=${searchTerm}`,
    });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest);
    const body = await response.json();

    // THEN: 성공 응답 확인 및 데이터 검증
    expect(response.status).toBe(200);
    expect(body).toEqual(mockResult);
    expect(mockedFetchReviewsPaginated).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      search: searchTerm,
      uid: undefined,
    });
  });

  it("search 쿼리 파라미터가 없으면 400 에러를 반환해야 합니다", async () => {
    // GIVEN: search 파라미터가 없는 요청
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/search`,
    });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest);
    const body = await response.json();

    // THEN: 400 에러 응답 확인
    expect(response.status).toBe(400);
    expect(body.error).toBe("검색어를 전달해주세요.");
  });

  it("search 쿼리 파라미터가 비어있으면 400 에러를 반환해야 합니다", async () => {
    // GIVEN: search 파라미터는 있지만 값이 비어있는 요청
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/search?search=`,
    });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest);
    const body = await response.json();

    // THEN: 400 에러 응답 확인
    expect(response.status).toBe(400);
    expect(body.error).toBe("검색어를 전달해주세요.");
  });

  it("데이터 조회 중 서버 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    // GIVEN: fetchReviewsPaginated 함수에서 에러가 발생하는 상황
    const errorMessage = "DB 조회 오류";
    mockedFetchReviewsPaginated.mockRejectedValue(new Error(errorMessage));
    const searchTerm = "ErrorCase";
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/search?search=${searchTerm}`,
    });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest);
    const body = await response.json();

    // THEN: 500 에러 응답 확인
    expect(response.status).toBe(500);
    expect(body.error).toBe(errorMessage);
  });

  it("모든 페이지네이션 파라미터가 올바르게 전달되어야 합니다", async () => {
    // GIVEN: 모든 파라미터가 포함된 요청
    const mockResult = { data: [], hasMore: false };
    mockedFetchReviewsPaginated.mockResolvedValue(mockResult);
    const searchTerm = "Matrix";
    const uid = "user-123";
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/search?search=${searchTerm}&page=3&pageSize=20&uid=${uid}`,
    });

    // WHEN: GET 핸들러 호출
    await GET(request as NextRequest);

    // THEN: 모든 파라미터가 fetch 함수에 올바르게 전달됨
    expect(mockedFetchReviewsPaginated).toHaveBeenCalledWith({
      page: 3,
      pageSize: 20,
      search: searchTerm,
      uid: uid,
    });
  });
});
