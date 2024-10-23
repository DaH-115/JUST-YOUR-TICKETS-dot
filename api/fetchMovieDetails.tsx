import { Movie } from "api/fetchNowPlayingMovies";
import { ErrorResponse } from "api/error-type";

type FetchMovieDetailsResult = Movie | ErrorResponse;

export async function fetchMovieDetails(
  id: number,
): Promise<FetchMovieDetailsResult> {
  const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`;

  try {
    const res = await fetch(movieDetailsUrl, { cache: "force-cache" });

    if (!res.ok) {
      return {
        title: `API 오류 (${res.status})`,
        errorMessage: `영화 상세 정보를 불러오는 데 실패했습니다: ${res.statusText}`,
        status: res.status,
      };
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      title: "네트워크 오류",
      errorMessage:
        "서버와의 연결에 문제가 발생했습니다. 인터넷 연결을 확인해 주세요.",
    };
  }
}
