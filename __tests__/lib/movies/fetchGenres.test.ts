import { fetchGenres } from "lib/movies/fetchGenres";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("fetchGenres", () => {
  const mockTmdbApiKey = "test-api-key";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TMDB_API_KEY = mockTmdbApiKey;
  });

  afterEach(() => {
    delete process.env.TMDB_API_KEY;
  });

  test("성공: TMDB API로부터 장르 목록을 받아와 맵 형태로 반환해야 함", async () => {
    const mockGenresResponse = {
      genres: [
        { id: 28, name: "액션" },
        { id: 12, name: "모험" },
        { id: 16, name: "애니메이션" },
      ],
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGenresResponse),
    });

    const genreMap = await fetchGenres();

    expect(genreMap).toEqual({
      28: "액션",
      12: "모험",
      16: "애니메이션",
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${mockTmdbApiKey}&language=ko`,
    );
  });

  test("실패: API 응답이 실패하면 에러를 던져야 함", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    });

    await expect(fetchGenres()).rejects.toThrow("Failed to fetch genres");
  });
});
