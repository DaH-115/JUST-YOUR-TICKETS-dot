import { Movie } from "api/fetchNowPlayingMovies";
import { ErrorResponse } from "api/error-type";

type FetchSearchMoviesResult = Movie[] | ErrorResponse;

export async function fetchSearchMovies(
  query: string,
): Promise<FetchSearchMoviesResult> {
  const searchMoviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&query=${query}&include_adult=true&language=ko-KR`;

  try {
    const res = await fetch(searchMoviesUrl);

    if (!res.ok) {
      return {
        title: `API 오류 (${res.status})`,
        errorMessage: `영화를 불러오는 데 실패했습니다: ${res.statusText}`,
        status: res.status,
      };
    }

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      title: "네트워크 오류",
      errorMessage:
        "서버와의 연결에 문제가 발생했습니다. 인터넷 연결을 확인해 주세요.",
    };
  }
}
