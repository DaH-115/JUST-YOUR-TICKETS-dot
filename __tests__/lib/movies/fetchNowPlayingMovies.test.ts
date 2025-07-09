import { fetchNowPlayingMovies } from "lib/movies/fetchNowPlayingMovies";
import { enrichMovieData } from "lib/movies/utils/enrichMovieData";

jest.mock("lib/movies/utils/enrichMovieData");

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockedEnrichMovieData = enrichMovieData as jest.Mock;

describe("fetchNowPlayingMovies", () => {
  const mockTmdbApiKey = "test-api-key";
  const mockApiResponse = {
    results: [{ id: 1, title: "Now Playing Movie" }],
  };
  const mockEnrichedResponse = [
    {
      id: 1,
      title: "Now Playing Movie",
      genres: ["드라마"],
      certification: "ALL",
    },
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

  test("성공: 상영 중인 영화 목록을 가져와 enrichMovieData로 전달 후 반환해야 함", async () => {
    const result = await fetchNowPlayingMovies();

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${mockTmdbApiKey}&include_adult=true&language=ko-KR`,
      expect.any(Object),
    );
    expect(mockedEnrichMovieData).toHaveBeenCalledWith(mockApiResponse.results);
    expect(result).toEqual(mockEnrichedResponse);
  });

  test("실패: TMDB API 키가 없으면 에러를 던져야 함", async () => {
    delete process.env.TMDB_API_KEY;
    await expect(fetchNowPlayingMovies()).rejects.toThrow(
      "TMDB API 키가 설정되지 않았습니다.",
    );
  });

  test("실패: fetch 응답이 실패하면 에러를 던져야 함", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(fetchNowPlayingMovies()).rejects.toThrow(
      "상영 중인 영화를 불러올 수 없습니다.",
    );
  });
});
