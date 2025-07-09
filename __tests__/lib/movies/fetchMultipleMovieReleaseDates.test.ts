import { fetchMultipleMovieReleaseDates } from "lib/movies/fetchMultipleMovieReleaseDates";

interface ReleaseDate {
  certification: string;
  meaning: string;
  release_date: string;
}

interface ReleaseDatesResult {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

interface MovieReleaseDates {
  id: number;
  results: ReleaseDatesResult[];
}

jest.mock("lib/movies/fetchMovieReleaseDates");

describe("fetchMultipleMovieReleaseDates", () => {
  const mockMovieIds = [1, 2, 3];
  const mockApiResponse1 = { id: 1, results: [] };
  const mockApiResponse2 = { id: 2, results: [] };
  const mockApiResponse3 = { id: 3, results: [] };

  // 테스트에서 사용할 간단한 가짜 fetcher 함수를 만듭니다.
  const mockFetcher = jest.fn<Promise<MovieReleaseDates>, [number]>();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TMDB_API_KEY = "test-key";

    // 가짜 fetcher가 어떻게 동작할지 정의합니다.
    mockFetcher.mockImplementation(async (id: number) => {
      if (id === 1) return mockApiResponse1;
      if (id === 2) return mockApiResponse2;
      if (id === 3) return mockApiResponse3;
      throw new Error("테스트에서 예상치 못한 ID가 호출되었습니다.");
    });
  });

  test("제공된 fetcher를 사용하여 모든 영화의 데이터를 가져와야 합니다.", async () => {
    // 테스트 대상 함수에 가짜 fetcher를 직접 주입합니다.
    const results = await fetchMultipleMovieReleaseDates(
      mockMovieIds,
      mockFetcher,
    );

    // 결과 검증
    expect(results.size).toBe(3);
    expect(results.get(1)).toEqual(mockApiResponse1);
    expect(results.get(2)).toEqual(mockApiResponse2);
    expect(results.get(3)).toEqual(mockApiResponse3);

    // 가짜 함수 호출 검증
    expect(mockFetcher).toHaveBeenCalledTimes(3);
    expect(mockFetcher).toHaveBeenCalledWith(1);
    expect(mockFetcher).toHaveBeenCalledWith(2);
    expect(mockFetcher).toHaveBeenCalledWith(3);
  });
});
