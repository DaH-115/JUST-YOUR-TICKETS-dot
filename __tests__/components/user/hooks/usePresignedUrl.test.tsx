import { renderHook, waitFor } from "@testing-library/react";
import { usePresignedUrl } from "app/components/user/hooks/usePresignedUrl";
import { fetchPresignedUrl } from "app/utils/api/fetchPresignedUrl";

// fetchPresignedUrl 모킹
jest.mock("app/utils/api/fetchPresignedUrl");
const mockFetchPresignedUrl = fetchPresignedUrl as jest.MockedFunction<
  typeof fetchPresignedUrl
>;

// Firebase Auth 모킹
jest.mock("firebase-config", () => ({
  isAuth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
    },
  },
}));

// Auth Context 모킹
const mockUseAuth = jest.fn();
jest.mock("store/context/auth/authContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("usePresignedUrl", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 기본 인증 상태 설정
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });
    // 캐시 초기화
    const cache = (global as { presignedUrlCache?: Map<string, unknown> })
      .presignedUrlCache;
    if (cache) {
      cache.clear();
    }
  });

  describe("기본 기능", () => {
    test("key가 없으면 fallbackUrl을 반환한다", () => {
      const { result } = renderHook(() =>
        usePresignedUrl({
          key: null,
          fallbackUrl: "https://example.com/fallback.jpg",
        }),
      );

      expect(result.current.url).toBe("https://example.com/fallback.jpg");
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test("key가 빈 문자열이면 fallbackUrl을 반환한다", () => {
      const { result } = renderHook(() =>
        usePresignedUrl({
          key: "",
          fallbackUrl: "https://example.com/fallback.jpg",
        }),
      );

      expect(result.current.url).toBe("https://example.com/fallback.jpg");
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test("인증이 필요하지만 인증되지 않은 경우 에러를 반환한다", () => {
      // 인증되지 않은 상태로 모킹
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      const { result } = renderHook(() =>
        usePresignedUrl({
          key: "test-key",
          isPublic: false,
        }),
      );

      expect(result.current.url).toBe("");
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("인증이 필요합니다.");
    });

    test("공개 리소스는 인증 없이 요청한다", async () => {
      mockFetchPresignedUrl.mockResolvedValue({
        url: "https://example.com/presigned-url",
        expiresIn: 3600,
      });

      const { result } = renderHook(() =>
        usePresignedUrl({
          key: "public-key",
          isPublic: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.url).toBe("https://example.com/presigned-url");
      expect(result.current.error).toBe(null);
      expect(mockFetchPresignedUrl).toHaveBeenCalledWith({
        key: "public-key",
        isPublic: true,
        idToken: null,
        signal: expect.any(AbortSignal),
      });
    });
  });

  describe("캐시 기능", () => {
    test("캐시된 URL이 유효하면 캐시에서 반환한다", async () => {
      const mockUrl = "https://example.com/cached-url";
      const mockExpiresIn = 3600;

      mockFetchPresignedUrl.mockResolvedValue({
        url: mockUrl,
        expiresIn: mockExpiresIn,
      });

      // 첫 번째 호출로 캐시에 저장
      const { result: firstResult } = renderHook(() =>
        usePresignedUrl({
          key: "test-key",
        }),
      );

      await waitFor(() => {
        expect(firstResult.current.loading).toBe(false);
      });

      // 두 번째 호출 - 캐시에서 반환되어야 함
      const { result: secondResult } = renderHook(() =>
        usePresignedUrl({
          key: "test-key",
        }),
      );

      await waitFor(() => {
        expect(secondResult.current.loading).toBe(false);
      });

      // fetchPresignedUrl이 한 번만 호출되었는지 확인 (캐시 사용)
      expect(mockFetchPresignedUrl).toHaveBeenCalledTimes(1);
      expect(secondResult.current.url).toBe(mockUrl);
    });
  });

  describe("에러 처리", () => {
    test("API 호출 실패 시 에러를 반환한다", async () => {
      mockFetchPresignedUrl.mockRejectedValue(new Error("API 오류"));

      const { result } = renderHook(() =>
        usePresignedUrl({
          key: "error-test-key",
          fallbackUrl: "https://example.com/fallback.jpg",
        }),
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.url).toBe("https://example.com/fallback.jpg");
      expect(result.current.error).toBe("API 오류");
    });
  });
});
