import { ErrorResponse } from "api/error-type";

export interface MovieTrailer {
  id: string;
  name: string;
  key: string;
}

interface VideoResult {
  results: MovieTrailer[];
}

type FetchVideoResult = VideoResult | ErrorResponse;

export async function fetchVideosMovies(id: number): Promise<FetchVideoResult> {
  const videoMoviesUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`;

  try {
    const res = await fetch(videoMoviesUrl, { cache: "force-cache" });

    if (!res.ok) {
      return {
        title: `API 오류 (${res.status})`,
        errorMessage: `영화 트레일러를 불러오는 데 실패했습니다: ${res.statusText}`,
        status: res.status,
      };
    }

    const data = await res.json();
    return { results: data.results };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      title: "네트워크 오류",
      errorMessage:
        "서버와의 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
