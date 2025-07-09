import { fetchMovieCredits } from "lib/movies/fetchMovieCredits";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("fetchMovieCredits", () => {
  const mockMovieId = 789;
  const mockTmdbApiKey = "test-api-key";
  const mockApiResponse = {
    cast: [
      { id: 1, name: "Actor A", character: "Character A" },
      { id: 2, name: "Actor B", character: "Character B" },
    ],
    crew: [{ id: 3, name: "Director C", job: "Director" }],
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

  test("성공: 영화 출연진/제작진 정보를 가져와 반환해야 함", async () => {
    const result = await fetchMovieCredits(mockMovieId);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.themoviedb.org/3/movie/${mockMovieId}/credits?api_key=${mockTmdbApiKey}&language=ko-KR`,
      expect.any(Object),
    );
    expect(result).toEqual(mockApiResponse);
  });

  test("실패: TMDB API 키가 없으면 에러를 던져야 함", async () => {
    delete process.env.TMDB_API_KEY;
    await expect(fetchMovieCredits(mockMovieId)).rejects.toThrow(
      "TMDB API 키가 설정되지 않았습니다.",
    );
  });

  test("실패: fetch 응답이 실패하면 에러를 던져야 함", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(fetchMovieCredits(mockMovieId)).rejects.toThrow(
      "영화 출연진 정보를 불러올 수 없습니다.",
    );
  });
});
