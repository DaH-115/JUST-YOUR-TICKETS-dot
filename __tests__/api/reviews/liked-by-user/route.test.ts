import { GET } from "app/api/reviews/liked-by-user/route";
import { fetchLikedReviewsPaginated } from "lib/reviews/fetchLikedReviewsPaginated";
import { NextRequest } from "next/server";

jest.mock("lib/reviews/fetchLikedReviewsPaginated");
const mockedFetch = fetchLikedReviewsPaginated as jest.Mock;

describe("GET /api/reviews/liked-by-user", () => {
  afterEach(() => {
    // 각 테스트 후 mock 호출 기록 초기화
    jest.clearAllMocks();
  });

  test("성공적으로 '좋아요'한 리뷰 목록을 조회하고 200 상태 코드를 반환해야 합니다", async () => {
    // 정상적으로 uid, page, pageSize가 전달되고, fetch 함수가 성공적으로 데이터를 반환하는 경우
    const mockResult = { data: [{ id: "liked-review-1" }], hasMore: false };
    mockedFetch.mockResolvedValue(mockResult);
    const uid = "test-user-id";
    const req = new NextRequest(
      `http://localhost/api/reviews/liked-by-user?uid=${uid}&page=1&pageSize=10`,
    );
    const res = await GET(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toEqual(mockResult);
    expect(mockedFetch).toHaveBeenCalledWith({
      uid,
      page: 1,
      pageSize: 10,
      search: "",
    });
  });

  test("uid가 없으면 400 에러를 반환해야 한다", async () => {
    // uid 파라미터가 없는 경우 400 반환
    const req = new NextRequest("http://localhost/api/reviews/liked-by-user");
    const res = await GET(req);
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toBe("uid 쿼리 파라미터를 반드시 넘겨주세요");
  });

  test("데이터 조회 중 서버 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    // fetchLikedReviewsPaginated 함수에서 에러가 발생하는 경우 500 반환
    const errorMessage = "DB 조회 오류";
    mockedFetch.mockRejectedValue(new Error(errorMessage));
    const uid = "test-user-id";
    const req = new NextRequest(
      `http://localhost/api/reviews/liked-by-user?uid=${uid}`,
    );
    const res = await GET(req);
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.error).toBe(errorMessage);
  });

  test("페이지네이션 파라미터가 없으면 기본값을 사용해야 한다", async () => {
    // page, pageSize 파라미터가 없을 때 기본값(1, 10)으로 fetch 함수 호출
    const uid = "test-uid";
    const req = new NextRequest(
      `http://localhost/api/reviews/liked-by-user?uid=${uid}`,
    );
    await GET(req);
    expect(mockedFetch).toHaveBeenCalledWith({
      uid,
      page: 1,
      pageSize: 10,
      search: "",
    });
  });

  test("검색어가 있으면 검색어를 포함하여 호출해야 한다", async () => {
    // search 파라미터가 있을 때 해당 값이 fetch 함수에 전달되는지 검증
    const uid = "test-uid";
    const searchTerm = "test search";
    const req = new NextRequest(
      `http://localhost/api/reviews/liked-by-user?uid=${uid}&search=${searchTerm}`,
    );
    await GET(req);
    expect(mockedFetch).toHaveBeenCalledWith({
      uid,
      page: 1,
      pageSize: 10,
      search: searchTerm,
    });
  });
});
