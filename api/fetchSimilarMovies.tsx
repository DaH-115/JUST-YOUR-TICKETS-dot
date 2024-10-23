import { Movie } from "api/fetchNowPlayingMovies";
import { ErrorResponse } from "api/error-type";

interface SimilarMoviesResult {
  results: Movie[];
}

type FetchSimilarMoviesResult = SimilarMoviesResult | ErrorResponse;

export async function fetchSimilarMovies(
  id: number,
): Promise<FetchSimilarMoviesResult> {
  const similarMoviesUrl = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`;

  try {
    const res = await fetch(similarMoviesUrl, { cache: "force-cache" });

    if (!res.ok) {
      return {
        title: `API 오류 (${res.status})`,
        errorMessage: `비슷한 영화를 불러오는 데 실패했습니다: ${res.statusText}`,
        status: res.status,
      };
    }

    const data = await res.json();
    return { results: data.results };
  } catch (error) {
    console.error("비슷한 영화 fetch 오류:", error);
    return {
      title: "네트워크 오류",
      errorMessage:
        "서버와의 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
