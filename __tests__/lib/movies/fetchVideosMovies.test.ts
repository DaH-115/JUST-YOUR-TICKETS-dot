import { fetchVideosMovies } from "lib/movies/fetchVideosMovies";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("fetchVideosMovies", () => {
  const mockMovieId = 303;
  const mockTmdbApiKey = "test-api-key";
  const mockApiResponse = {
    results: [
      { id: "1", name: "Official Trailer", key: "trailer-key" },
      { id: "2", name: "Teaser", key: "teaser-key" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TMDB_API_KEY = mockTmdbApiKey;
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });
  });

  afterEach(() => {
    delete process.env.TMDB_API_KEY;
  });

  test("성공: 영화 트레일러 목록을 가져와 results 객체로 감싸 반환해야 함", async () => {
    const result = await fetchVideosMovies(mockMovieId);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.themoviedb.org/3/movie/${mockMovieId}/videos?api_key=${mockTmdbApiKey}&language=ko-KR`,
      expect.any(Object),
    );
    expect(result).toEqual({ results: mockApiResponse.results });
  });

  test("실패: TMDB API 키가 없으면 에러를 던져야 함", async () => {
    delete process.env.TMDB_API_KEY;
    await expect(fetchVideosMovies(mockMovieId)).rejects.toThrow(
      "TMDB API 키가 설정되지 않았습니다.",
    );
  });

  test("실패: fetch 응답이 실패하면 에러를 던져야 함", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(fetchVideosMovies(mockMovieId)).rejects.toThrow(
      "영화 트레일러를 불러올 수 없습니다.",
    );
  });
});
