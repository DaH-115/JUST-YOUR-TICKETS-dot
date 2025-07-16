import { GET, POST } from "app/api/reviews/route";
import { NextRequest } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { updateUserActivityLevel } from "lib/users/updateUserActivityLevel";
import { updateCommentsActivityLevel } from "app/api/users/[uid]/route.helper";
import { revalidatePath, revalidateTag } from "next/cache";
import { createMockRequest } from "__tests__/utils/test-utils";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
// 테스트는 외부 서비스(DB, API)에 의존하지 않고 독립적으로 실행되어야 합니다.
// 'jest.mock'을 사용하면 실제 모듈 대신 가짜 모듈(mock)을 사용하도록 설정할 수 있습니다.
jest.mock("lib/reviews/fetchReviewsPaginated");
jest.mock("lib/auth/verifyToken");
jest.mock("lib/users/updateUserActivityLevel");
jest.mock("app/api/users/[uid]/route.helper");
jest.mock("next/cache");
jest.mock("firebase-admin-config", () => ({
  adminFirestore: {
    collection: jest.fn().mockReturnThis(),
    add: jest.fn(),
  },
}));

// TypeScript에서 모킹된 함수의 타입을 명확히 하기 위해 변수에 할당합니다.
const mockedFetchReviewsPaginated = fetchReviewsPaginated as jest.Mock;
const mockedVerifyAuthToken = verifyAuthToken as jest.Mock;
const mockedVerifyResourceOwnership = verifyResourceOwnership as jest.Mock;
const mockedUpdateUserActivityLevel = updateUserActivityLevel as jest.Mock;
const mockedUpdateCommentsActivityLevel =
  updateCommentsActivityLevel as jest.Mock;
const mockedRevalidatePath = revalidatePath as jest.Mock;
const mockedRevalidateTag = revalidateTag as jest.Mock;
const mockedFirestoreAdd = adminFirestore.collection("movie-reviews")
  .add as jest.Mock;

// ==== 테스트 스위트(Test Suite): 리뷰 API 라우트 테스트 ====
// 'describe'는 연관된 테스트들을 하나의 그룹으로 묶어주는 역할을 합니다.
describe("리뷰 API 라우트 (/api/reviews)", () => {
  // 'afterEach'는 각 테스트 케이스가 끝난 후에 실행됩니다.
  // 여기서는 모든 모킹 함수의 호출 기록을 초기화하여 테스트 간의 독립성을 보장합니다.
  afterEach(() => {
    jest.clearAllMocks();
  });

  // POST 요청에 대한 테스트 그룹
  describe("POST /api/reviews", () => {
    const mockUid = "test-uid";
    const mockReviewData = {
      user: {
        uid: mockUid,
        displayName: "testUser",
        photoURL: "http://example.com/avatar.png",
      },
      review: {
        movieId: 123,
        movieTitle: "Test Movie",
        content: "Great movie!",
        rating: 5,
      },
    };

    // 'it' 또는 'test'는 개별 테스트 케이스를 정의합니다.
    it("성공적으로 리뷰를 생성하고 201 상태 코드를 반환해야 합니다", async () => {
      // -- GIVEN (주어진 상황) --
      // 모든 외부 의존성이 성공적으로 동작한다고 가정합니다.
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
      mockedVerifyResourceOwnership.mockReturnValue({ success: true });
      mockedFirestoreAdd.mockResolvedValue({ id: "new-review-id" });
      mockedUpdateUserActivityLevel.mockResolvedValue("새싹"); // 사용자 등급 업데이트 성공

      // -- WHEN (무엇을 했을 때) --
      // API에 보낼 요청 객체를 생성하고, POST 핸들러를 호출합니다.
      const request = createMockRequest({
        method: "POST",
        body: mockReviewData,
      });
      const response = await POST(request);
      const body = await response.json();

      // -- THEN (결과는 이래야 한다) --
      // 'expect'를 사용하여 함수의 실행 결과가 예상과 일치하는지 검증합니다.
      expect(response.status).toBe(201);
      expect(body).toEqual({
        success: true,
        id: "new-review-id",
        message: "리뷰가 성공적으로 생성되었습니다.",
      });

      // Firestore에 리뷰가 올바르게 추가되었는지 확인
      expect(mockedFirestoreAdd).toHaveBeenCalledTimes(1);
      expect(mockedFirestoreAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          user: mockReviewData.user,
          review: expect.objectContaining({
            ...mockReviewData.review,
            likeCount: 0, // likeCount는 0으로 초기화되어야 함
          }),
        }),
      );

      // 비동기 백그라운드 작업(등급 업데이트)이 실행될 시간을 줍니다.
      await new Promise(process.nextTick);

      // 사용자 및 댓글 등급 업데이트 함수가 올바른 인자와 함께 호출되었는지 확인
      expect(mockedUpdateUserActivityLevel).toHaveBeenCalledWith(mockUid);
      expect(mockedUpdateCommentsActivityLevel).toHaveBeenCalledWith(
        mockUid,
        "새싹",
      );

      // 캐시 무효화 함수가 올바른 경로와 태그로 호출되었는지 확인
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/ticket-list");
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/");
      expect(mockedRevalidateTag).toHaveBeenCalledWith("reviews");
    });

    it("인증 토큰이 유효하지 않으면 401 에러를 반환해야 합니다", async () => {
      // GIVEN: 토큰 검증이 실패하는 상황
      mockedVerifyAuthToken.mockResolvedValue({
        success: false,
        error: "Invalid token",
        statusCode: 401,
      });

      // WHEN: API 요청
      const request = createMockRequest({
        method: "POST",
        body: mockReviewData,
      });
      const response = await POST(request);
      const body = await response.json();

      // THEN: 401 상태 코드와 에러 메시지 반환
      expect(response.status).toBe(401);
      expect(body).toEqual({ error: "Invalid token" });
    });

    it("필수 필드(user 또는 review)가 누락되면 400 에러를 반환해야 합니다", async () => {
      // GIVEN: 인증은 성공했지만, 요청 본문에 review 데이터가 누락된 상황
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });

      // WHEN: review 데이터 없이 API 요청
      const request = createMockRequest({
        method: "POST",
        body: { user: mockReviewData.user },
      });
      const response = await POST(request);
      const body = await response.json();

      // THEN: 400 상태 코드와 적절한 에러 메시지 반환
      expect(response.status).toBe(400);
      expect(body).toEqual({ error: "user와 review 데이터가 필요합니다." });
    });

    it("리소스 소유자가 아니면 403 에러를 반환해야 합니다", async () => {
      // GIVEN: 인증된 사용자와 리뷰 작성자의 UID가 다른 상황
      mockedVerifyAuthToken.mockResolvedValue({
        success: true,
        uid: "another-uid",
      });
      mockedVerifyResourceOwnership.mockReturnValue({
        success: false,
        error: "Forbidden",
        statusCode: 403,
      });

      // WHEN: API 요청
      const request = createMockRequest({
        method: "POST",
        body: mockReviewData,
      });
      const response = await POST(request);
      const body = await response.json();

      // THEN: 403 상태 코드와 에러 메시지 반환
      expect(response.status).toBe(403);
      expect(body).toEqual({ error: "Forbidden" });
      // 소유권 검증 함수가 올바른 UID로 호출되었는지 확인
      expect(mockedVerifyResourceOwnership).toHaveBeenCalledWith(
        "another-uid",
        mockReviewData.user.uid,
      );
    });

    it("리뷰 생성 중 서버 오류가 발생하면 500 에러를 반환해야 합니다", async () => {
      // GIVEN: Firestore에 데이터를 추가하는 과정에서 에러가 발생하는 상황
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: mockUid });
      mockedVerifyResourceOwnership.mockReturnValue({ success: true });
      mockedFirestoreAdd.mockRejectedValue(new Error("Firestore error"));

      // WHEN: API 요청
      const request = createMockRequest({
        method: "POST",
        body: mockReviewData,
      });
      const response = await POST(request);
      const body = await response.json();

      // THEN: 500 상태 코드와 에러 메시지 반환
      expect(response.status).toBe(500);
      expect(body).toEqual({ error: "리뷰 생성에 실패했습니다." });
    });
  });

  // GET 요청에 대한 테스트 그룹
  describe("GET /api/reviews", () => {
    it("기본 페이지네이션으로 리뷰 목록을 성공적으로 가져와야 합니다", async () => {
      // GIVEN: 페이지네이션된 리뷰 데이터가 준비된 상황
      const mockReviews = {
        data: [{ id: "1", content: "Review 1" }],
        hasMore: false,
      };
      mockedFetchReviewsPaginated.mockResolvedValue(mockReviews);

      // WHEN: 파라미터 없이 GET 요청
      const request = createMockRequest({
        method: "GET",
        url: "http://localhost/api/reviews?page=1&pageSize=10",
      });
      const response = await GET(request as NextRequest);
      const body = await response.json();

      // THEN: 200 상태 코드와 함께 데이터가 반환되고, 기본값으로 함수가 호출됨
      expect(response.status).toBe(200);
      expect(body).toEqual(mockReviews);
      expect(mockedFetchReviewsPaginated).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        uid: undefined,
        search: "",
      });
    });

    it("지정된 페이지네이션 및 uid로 리뷰 목록을 성공적으로 가져와야 합니다", async () => {
      // GIVEN: 페이지네이션된 리뷰 데이터가 준비된 상황
      const mockReviews = {
        data: [{ id: "2", content: "Review 2" }],
        hasMore: true,
      };
      mockedFetchReviewsPaginated.mockResolvedValue(mockReviews);

      // WHEN: 페이지, 페이지 크기, uid 파라미터를 포함하여 GET 요청
      const request = createMockRequest({
        method: "GET",
        url: "http://localhost/api/reviews?page=2&pageSize=5&uid=test-user-id",
      });
      const response = await GET(request as NextRequest);
      const body = await response.json();

      // THEN: 200 상태 코드와 함께 데이터가 반환되고, 지정된 값으로 함수가 호출됨
      expect(response.status).toBe(200);
      expect(body).toEqual(mockReviews);
      expect(mockedFetchReviewsPaginated).toHaveBeenCalledWith({
        page: 2,
        pageSize: 5,
        uid: "test-user-id",
        search: "",
      });
    });

    it("검색어를 포함하여 리뷰 목록을 성공적으로 가져와야 합니다", async () => {
      // GIVEN: 검색 결과 데이터가 준비된 상황
      const mockSearchResults = {
        data: [{ id: "search-1", content: "영화 제목 포함 리뷰" }],
        hasMore: false,
      };
      mockedFetchReviewsPaginated.mockResolvedValue(mockSearchResults);

      // WHEN: search 파라미터를 포함하여 GET 요청
      const request = createMockRequest({
        method: "GET",
        url: "http://localhost/api/reviews?page=1&pageSize=10&search=영화제목",
      });
      const response = await GET(request as NextRequest);
      const body = await response.json();

      // THEN: 200 상태 코드와 함께 검색 결과가 반환되고, search 파라미터가 올바르게 전달됨
      expect(response.status).toBe(200);
      expect(body).toEqual(mockSearchResults);
      expect(mockedFetchReviewsPaginated).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        uid: undefined,
        search: "영화제목",
      });
    });

    it("uid와 검색어를 함께 포함하여 특정 사용자의 리뷰를 검색해야 합니다", async () => {
      // GIVEN: 특정 사용자의 검색 결과 데이터가 준비된 상황
      const mockUserSearchResults = {
        data: [{ id: "user-search-1", content: "특정 사용자의 검색 결과" }],
        hasMore: false,
      };
      mockedFetchReviewsPaginated.mockResolvedValue(mockUserSearchResults);

      // WHEN: uid와 search 파라미터를 모두 포함하여 GET 요청
      const request = createMockRequest({
        method: "GET",
        url: "http://localhost/api/reviews?page=1&pageSize=10&uid=user123&search=액션영화",
      });
      const response = await GET(request as NextRequest);
      const body = await response.json();

      // THEN: 200 상태 코드와 함께 검색 결과가 반환되고, 모든 파라미터가 올바르게 전달됨
      expect(response.status).toBe(200);
      expect(body).toEqual(mockUserSearchResults);
      expect(mockedFetchReviewsPaginated).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        uid: "user123",
        search: "액션영화",
      });
    });
  });
});
