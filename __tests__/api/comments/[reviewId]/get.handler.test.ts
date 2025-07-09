import { GET } from "app/api/comments/[reviewId]/get.handler";
import { NextRequest } from "next/server";
import { createMockRequest } from "__tests__/utils/test-utils";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
const mockUserDoc = { get: jest.fn() };
const mockUserCollection = { doc: jest.fn(() => mockUserDoc) };

const mockCommentsQuery = { docs: [] as any[], get: jest.fn() };
const mockSubCollection = {
  orderBy: jest.fn().mockReturnThis(),
  get: jest.fn(() => Promise.resolve(mockCommentsQuery)),
};
const mockMainDoc = { collection: jest.fn(() => mockSubCollection) };
const mockReviewsCollection = { doc: jest.fn(() => mockMainDoc) };

jest.mock("firebase-admin-config", () => ({
  adminFirestore: {
    collection: jest.fn((name) => {
      if (name === "users") return mockUserCollection;
      if (name === "movie-reviews") return mockReviewsCollection;
      // 예상치 못한 컬렉션 호출에 대한 폴백
      return { doc: jest.fn(() => ({ collection: jest.fn() })) };
    }),
  },
}));

describe("GET /api/comments/[reviewId]", () => {
  const mockReviewId = "test-review-id";

  beforeEach(() => {
    jest.clearAllMocks();
    // 각 테스트 전에 모킹된 함수의 상태를 초기화
    mockCommentsQuery.docs = [];
    mockUserDoc.get.mockClear();
    (mockSubCollection.orderBy as jest.Mock).mockClear();
    (mockSubCollection.get as jest.Mock).mockClear();
    (mockReviewsCollection.doc as jest.Mock).mockClear();
    (mockUserCollection.doc as jest.Mock).mockClear();
  });

  it("성공적으로 댓글 목록과 사용자 정보를 조회해야 합니다", async () => {
    // GIVEN: 댓글과 사용자 정보가 모두 존재하는 상황
    const mockCommentData = [
      { id: "comment1", authorId: "user1", content: "Great comment!" },
      { id: "comment2", authorId: "user2", content: "Another one." },
    ];
    mockCommentsQuery.docs = mockCommentData.map((c) => ({
      id: c.id,
      data: () => c,
    }));

    // 사용자 정보 모킹
    mockUserDoc.get
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({
          displayName: "User One",
          photoKey: "key1",
          activityLevel: "PRO",
        }),
      })
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({
          displayName: "User Two",
          photoKey: "key2",
          activityLevel: "MASTER",
        }),
      });

    const request = createMockRequest({ method: "GET" });

    // WHEN: GET 핸들러 호출
    const response = await GET(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    const body = await response.json();

    // THEN: 성공 응답 및 데이터 검증
    expect(response.status).toBe(200);
    expect(body.comments).toHaveLength(2);
    expect(body.comments[0].displayName).toBe("User One");
    expect(body.comments[1].displayName).toBe("User Two");
    expect(body.comments[0].activityLevel).toBe("PRO");
    expect(body.comments[1].activityLevel).toBe("MASTER");
    expect(mockReviewsCollection.doc).toHaveBeenCalledWith(mockReviewId);
    expect(mockUserCollection.doc).toHaveBeenCalledWith("user1");
    expect(mockUserCollection.doc).toHaveBeenCalledWith("user2");
  });

  it("사용자 정보 조회를 실패해도 댓글의 기본 정보로 응답해야 합니다", async () => {
    // GIVEN: 댓글은 있지만, 사용자 정보가 존재하지 않는 상황
    const mockCommentData = [
      {
        id: "comment1",
        authorId: "user1",
        content: "Test",
        displayName: "Fallback Name",
      },
    ];
    mockCommentsQuery.docs = mockCommentData.map((c) => ({
      id: c.id,
      data: () => c,
    }));

    mockUserDoc.get.mockResolvedValue({ exists: false }); // 사용자를 찾을 수 없음

    const request = createMockRequest({ method: "GET" });

    // WHEN
    const response = await GET(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    const body = await response.json();

    // THEN: 응답은 성공하고, 댓글에 저장된 displayName으로 대체되어야 함
    expect(response.status).toBe(200);
    expect(body.comments[0].displayName).toBe("Fallback Name");
  });

  it("댓글 조회 중 DB 오류가 발생하면 500 에러를 반환해야 합니다", async () => {
    // GIVEN: 댓글 컬렉션 조회에서 에러가 발생하는 상황
    (mockSubCollection.get as jest.Mock).mockRejectedValue(
      new Error("DB Connection Error"),
    );

    const request = createMockRequest({ method: "GET" });

    // WHEN
    const response = await GET(request as NextRequest, {
      params: { reviewId: mockReviewId },
    });
    const body = await response.json();

    // THEN
    expect(response.status).toBe(500);
    expect(body.error).toBe("댓글 조회에 실패했습니다.");
  });
});
