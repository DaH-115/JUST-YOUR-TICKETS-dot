import { GET } from "app/api/reviews/search/route";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";
import { createMockRequest } from "__tests__/utils/test-utils";
import { NextRequest } from "next/server";

jest.mock("lib/reviews/fetchReviewsPaginated");
const mockedFetchReviewsPaginated = fetchReviewsPaginated as jest.Mock;

describe("GET /api/reviews/search", () => {
  beforeEach(() => {
    // 각 테스트 전 mock 호출 기록 초기화
    mockedFetchReviewsPaginated.mockClear();
  });

  test("성공적으로 리뷰를 검색하고 200 상태 코드를 반환해야 합니다", async () => {
    // 정상적으로 검색어가 전달되고, fetch 함수가 성공적으로 데이터를 반환하는 경우
    const mockResult = { data: [{ id: "searched-review-1" }], hasMore: false };
    mockedFetchReviewsPaginated.mockResolvedValue(mockResult);
    const searchTerm = "Dune";
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/search?search=${searchTerm}`,
    });
    const response = await GET(request as NextRequest);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual(mockResult);
    expect(mockedFetchReviewsPaginated).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      search: searchTerm,
      uid: undefined,
    });
  });

  test("search 쿼리 파라미터가 없으면 400 에러를 반환해야 합니다", async () => {
    // search 파라미터가 없는 경우 400 반환
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/search`,
    });
    const response = await GET(request as NextRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toBe("검색어를 전달해주세요.");
  });

  test("search 쿼리 파라미터가 비어있으면 400 에러를 반환해야 합니다", async () => {
    // search 파라미터 값이 빈 문자열인 경우 400 반환
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/search?search=`,
    });
    const response = await GET(request as NextRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toBe("검색어를 전달해주세요.");
  });

  test("데이터 조회 중 서버 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    // fetchReviewsPaginated 함수에서 에러가 발생하는 경우 500 반환
    const errorMessage = "DB 조회 오류";
    mockedFetchReviewsPaginated.mockRejectedValue(new Error(errorMessage));
    const searchTerm = "ErrorCase";
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/search?search=${searchTerm}`,
    });
    const response = await GET(request as NextRequest);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.error).toBe(errorMessage);
  });

  test("모든 페이지네이션 파라미터가 올바르게 전달되어야 합니다", async () => {
    // page, pageSize, uid 등 모든 파라미터가 올바르게 fetch 함수에 전달되는지 검증
    const mockResult = { data: [], hasMore: false };
    mockedFetchReviewsPaginated.mockResolvedValue(mockResult);
    const searchTerm = "Matrix";
    const uid = "user-123";
    const request = createMockRequest({
      method: "GET",
      url: `http://localhost/api/reviews/search?search=${searchTerm}&page=3&pageSize=20&uid=${uid}`,
    });
    await GET(request as NextRequest);
    expect(mockedFetchReviewsPaginated).toHaveBeenCalledWith({
      page: 3,
      pageSize: 20,
      search: searchTerm,
      uid: uid,
    });
  });
});
