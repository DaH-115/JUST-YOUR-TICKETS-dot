import { fetchSimilarMovies } from "lib/movies/fetchSimilarMovies";
import { enrichMovieData } from "lib/movies/utils/enrichMovieData";

jest.mock("lib/movies/utils/enrichMovieData");

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockedEnrichMovieData = enrichMovieData as jest.Mock;

describe("fetchSimilarMovies", () => {
  const mockMovieId = 123;
  const mockTmdbApiKey = "test-api-key";
  const mockApiResponse = {
    results: [{ id: 456, title: "Similar Movie" }],
  };
  const mockEnrichedResponse = [
    {
      id: 456,
      title: "Similar Movie",
      genres: ["SF"],
      certification: "12",
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

  test("성공: 비슷한 영화 목록을 가져와 enrichMovieData로 전달 후 반환해야 함", async () => {
    const result = await fetchSimilarMovies(mockMovieId);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.themoviedb.org/3/movie/${mockMovieId}/similar?api_key=${mockTmdbApiKey}&language=ko-KR`,
      expect.any(Object),
    );
    expect(mockedEnrichMovieData).toHaveBeenCalledWith(mockApiResponse.results);
    expect(result).toEqual(mockEnrichedResponse);
  });

  test("실패: TMDB API 키가 없으면 에러를 던져야 함", async () => {
    delete process.env.TMDB_API_KEY;
    await expect(fetchSimilarMovies(mockMovieId)).rejects.toThrow(
      "TMDB API 키가 설정되지 않았습니다.",
    );
  });

  test("실패: fetch 응답이 실패하면 에러를 던져야 함", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(fetchSimilarMovies(mockMovieId)).rejects.toThrow(
      "비슷한 영화를 불러올 수 없습니다.",
    );
  });
});
