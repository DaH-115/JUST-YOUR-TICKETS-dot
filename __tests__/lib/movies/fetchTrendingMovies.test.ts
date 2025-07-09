import { fetchTrendingMovies } from "lib/movies/fetchTrendingMovies";
import { enrichMovieData } from "lib/movies/utils/enrichMovieData";

jest.mock("lib/movies/utils/enrichMovieData");

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockedEnrichMovieData = enrichMovieData as jest.Mock;

describe("fetchTrendingMovies", () => {
  const mockTmdbApiKey = "test-api-key";
  const mockApiResponse = {
    results: [{ id: 1, title: "Trending Movie" }],
  };
  const mockEnrichedResponse = [
    { id: 1, title: "Trending Movie", genres: ["액션"], certification: "15" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TMDB_API_KEY = mockTmdbApiKey;
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });
    mockedEnrichMovieData.mockResolvedValue(mockEnrichedResponse);
  });

  afterEach(() => {
    delete process.env.TMDB_API_KEY;
  });

  test("성공: 트렌딩 영화 목록을 가져와 enrichMovieData로 전달 후 반환해야 함", async () => {
    const result = await fetchTrendingMovies();

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${mockTmdbApiKey}&language=ko-KR`,
      expect.any(Object),
    );
    expect(mockedEnrichMovieData).toHaveBeenCalledWith(mockApiResponse.results);
    expect(result).toEqual(mockEnrichedResponse);
  });

  test("실패: TMDB API 키가 없으면 에러를 던져야 함", async () => {
    delete process.env.TMDB_API_KEY;
    await expect(fetchTrendingMovies()).rejects.toThrow(
      "TMDB API 키가 설정되지 않았습니다.",
    );
  });

  test("실패: fetch 응답이 실패하면 에러를 던져야 함", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(fetchTrendingMovies()).rejects.toThrow(
      "트렌딩 영화를 불러올 수 없습니다.",
    );
  });
});
