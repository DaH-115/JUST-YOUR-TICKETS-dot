import { GET, POST, DELETE } from "app/api/watchlist/route";
import { NextRequest } from "next/server";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { revalidatePath } from "next/cache";
import { adminFirestore } from "firebase-admin-config";
import { fetchMovieDetails } from "lib/movies/fetchMovieDetails";
import { createMockRequest } from "__tests__/utils/test-utils";

jest.mock("lib/auth/verifyToken");
jest.mock("next/cache");
jest.mock("lib/movies/fetchMovieDetails");
jest.mock("firebase-admin-config", () => ({
  adminFirestore: {
    collection: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    get: jest.fn(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedVerifyAuthToken = verifyAuthToken as jest.Mock;
const mockedVerifyResourceOwnership = verifyResourceOwnership as jest.Mock;
const mockedRevalidatePath = revalidatePath as jest.Mock;
const mockedFetchMovieDetails = fetchMovieDetails as jest.Mock;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const firestore = adminFirestore as any;

describe("watchlist API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/watchlist", () => {
    test("uid 없으면 400", async () => {
      const req = new NextRequest("http://localhost/api/watchlist");
      const res = await GET(req);
      expect(res.status).toBe(400);
    });

    test("인증 실패시 401", async () => {
      mockedVerifyAuthToken.mockResolvedValue({
        success: false,
        error: "인증 실패",
      });
      const req = new NextRequest("http://localhost/api/watchlist?uid=u1");
      const res = await GET(req);
      expect(res.status).toBe(401);
    });

    test("소유권 검증 실패시 403", async () => {
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: "u1" });
      mockedVerifyResourceOwnership.mockReturnValue({
        success: false,
        error: "권한 없음",
      });
      const req = new NextRequest("http://localhost/api/watchlist?uid=u2");
      const res = await GET(req);
      expect(res.status).toBe(403);
    });

    test("정상 조회", async () => {
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: "u1" });
      mockedVerifyResourceOwnership.mockReturnValue({ success: true });
      firestore.get.mockResolvedValue({
        docs: [{ data: () => ({ uid: "u1", movieId: 1 }) }],
      });
      mockedFetchMovieDetails.mockResolvedValue({
        id: 1,
        title: "테스트 영화",
        original_title: "Test Movie",
        overview: "테스트 영화입니다",
        poster_path: "/test.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2024-01-01",
        vote_average: 8.5,
        runtime: "120",
        production_companies: [],
        genres: [{ id: 1, name: "액션" }],
        certification: "12",
      });

      const req = new NextRequest("http://localhost/api/watchlist?uid=u1");
      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.movies).toHaveLength(1);
      expect(body.movies[0].title).toBe("테스트 영화");
      expect(mockedFetchMovieDetails).toHaveBeenCalledWith(1);
    });

    test("영화 상세 정보 조회 실패시 기본 정보 반환", async () => {
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: "u1" });
      mockedVerifyResourceOwnership.mockReturnValue({ success: true });
      firestore.get.mockResolvedValue({
        docs: [{ data: () => ({ uid: "u1", movieId: 1 }) }],
      });
      mockedFetchMovieDetails.mockRejectedValue(new Error("API 오류"));

      const req = new NextRequest("http://localhost/api/watchlist?uid=u1");
      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.movies).toHaveLength(1);
      expect(body.movies[0].title).toBe("영화 정보를 불러올 수 없습니다");
    });
  });

  describe("POST /api/watchlist", () => {
    test("인증 실패시 401", async () => {
      mockedVerifyAuthToken.mockResolvedValue({
        success: false,
        error: "인증 실패",
      });
      const req = createMockRequest({
        method: "POST",
        url: "http://localhost/api/watchlist",
        body: { uid: "u1", movieId: 1 },
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    test("필수 파라미터 누락시 400", async () => {
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: "u1" });
      const req = createMockRequest({
        method: "POST",
        url: "http://localhost/api/watchlist",
        body: { uid: "u1" }, // movieId 누락
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    test("소유권 검증 실패시 403", async () => {
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: "u1" });
      mockedVerifyResourceOwnership.mockReturnValue({
        success: false,
        error: "권한 없음",
      });
      const req = createMockRequest({
        method: "POST",
        url: "http://localhost/api/watchlist",
        body: { uid: "u2", movieId: 1 }, // 다른 사용자
      });
      const res = await POST(req);
      expect(res.status).toBe(403);
    });

    test("성공적으로 추가", async () => {
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: "u1" });
      mockedVerifyResourceOwnership.mockReturnValue({ success: true });
      const req = createMockRequest({
        method: "POST",
        url: "http://localhost/api/watchlist",
        body: { uid: "u1", movieId: 1 },
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      expect(firestore.set).toHaveBeenCalled();
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/my-page/watchlist");
    });
  });

  describe("DELETE /api/watchlist", () => {
    test("인증 실패시 401", async () => {
      mockedVerifyAuthToken.mockResolvedValue({
        success: false,
        error: "인증 실패",
      });
      const req = createMockRequest({
        method: "DELETE",
        url: "http://localhost/api/watchlist",
        body: { uid: "u1", movieId: 1 },
      });
      const res = await DELETE(req);
      expect(res.status).toBe(401);
    });

    test("필수 파라미터 누락시 400", async () => {
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: "u1" });
      const req = createMockRequest({
        method: "DELETE",
        url: "http://localhost/api/watchlist",
        body: { uid: "u1" }, // movieId 누락
      });
      const res = await DELETE(req);
      expect(res.status).toBe(400);
    });

    test("소유권 검증 실패시 403", async () => {
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: "u1" });
      mockedVerifyResourceOwnership.mockReturnValue({
        success: false,
        error: "권한 없음",
      });
      const req = createMockRequest({
        method: "DELETE",
        url: "http://localhost/api/watchlist",
        body: { uid: "u2", movieId: 1 }, // 다른 사용자
      });
      const res = await DELETE(req);
      expect(res.status).toBe(403);
    });

    test("성공적으로 삭제", async () => {
      mockedVerifyAuthToken.mockResolvedValue({ success: true, uid: "u1" });
      mockedVerifyResourceOwnership.mockReturnValue({ success: true });
      const req = createMockRequest({
        method: "DELETE",
        url: "http://localhost/api/watchlist",
        body: { uid: "u1", movieId: 1 },
      });
      const res = await DELETE(req);
      expect(res.status).toBe(200);
      expect(firestore.delete).toHaveBeenCalled();
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/my-page/watchlist");
    });
  });
});
