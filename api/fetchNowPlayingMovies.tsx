import { ErrorResponse } from "api/error-type";

export interface Movie {
  genre_ids: number[];
  id: number;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime: string;
  production_companies: { id: number; name: string }[];
  backdrop_path?: string;
}

type FetchNowPlayingMoviesResult = Movie[] | ErrorResponse;

export async function fetchNowPlayingMovies(): Promise<FetchNowPlayingMoviesResult> {
  const nowPlayingMoviesUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&include_adult=true&language=ko-KR`;

  try {
    const res = await fetch(nowPlayingMoviesUrl);

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
