import { GET } from "app/api/reviews/liked-by-user/route";
import { fetchLikedReviewsPaginated } from "lib/reviews/fetchLikedReviewsPaginated";
import { NextRequest } from "next/server";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
jest.mock("lib/reviews/fetchLikedReviewsPaginated");

// TypeScript에서 모킹된 함수의 타입을 명확히 하기 위해 변수에 할당합니다.
const mockedFetch = fetchLikedReviewsPaginated as jest.Mock;

// ==== 테스트 스위트: '좋아요'한 리뷰 조회 API 핸들러 ====
describe("GET /api/reviews/liked-by-user", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("성공적으로 '좋아요'한 리뷰 목록을 조회하고 200 상태 코드를 반환해야 합니다", async () => {
    // GIVEN: fetchLikedReviewsPaginated 함수가 성공적으로 데이터를 반환하는 상황
    const mockResult = { data: [{ id: "liked-review-1" }], hasMore: false };
    mockedFetch.mockResolvedValue(mockResult);

    const uid = "test-user-id";
    const req = new NextRequest(
      `http://localhost/api/reviews/liked-by-user?uid=${uid}&page=1&pageSize=10`,
    );

    // WHEN: GET 핸들러 호출
    const res = await GET(req);
    const body = await res.json();

    // THEN: 성공 응답 확인 및 데이터 검증
    expect(res.status).toBe(200);
    expect(body).toEqual(mockResult);
    expect(mockedFetch).toHaveBeenCalledWith({
      uid,
      page: 1,
      pageSize: 10,
      search: "",
    });
  });

  it("uid가 없으면 400 에러를 반환해야 한다", async () => {
    const req = new NextRequest("http://localhost/api/reviews/liked-by-user");
    const res = await GET(req);
    const body = await res.json();

    // THEN: 400 에러 응답 확인
    expect(res.status).toBe(400);
    expect(body.error).toBe("uid 쿼리 파라미터를 반드시 넘겨주세요");
  });

  it("데이터 조회 중 서버 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
    // GIVEN: fetchLikedReviewsPaginated 함수에서 에러가 발생하는 상황
    const errorMessage = "DB 조회 오류";
    mockedFetch.mockRejectedValue(new Error(errorMessage));
    const uid = "test-user-id";
    const req = new NextRequest(
      `http://localhost/api/reviews/liked-by-user?uid=${uid}`,
    );

    // WHEN: GET 핸들러 호출
    const res = await GET(req);
    const body = await res.json();

    // THEN: 500 에러 응답 확인
    expect(res.status).toBe(500);
    expect(body.error).toBe(errorMessage);
  });

  it("페이지네이션 파라미터가 없으면 기본값을 사용해야 한다", async () => {
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

  it("검색어가 있으면 검색어를 포함하여 호출해야 한다", async () => {
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
