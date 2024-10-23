import { ErrorResponse } from "api/error-type";

export interface CastMember {
  id: number;
  name: string;
  original_name: string;
  character: string;
  gender: number;
  profile_path: string | null;
  cast_id: number;
  credit_id: string;
  adult: boolean;
  order: number;
  popularity: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  job: string;
  name: string;
  original_name: string;
  profile_path: string | null;
  gender: number;
  adult: boolean;
  credit_id: string;
  department: string;
  known_for_department: string;
  popularity: number;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

type FetchMovieCreditsResult = MovieCredits | ErrorResponse;

export async function fetchMovieCredits(
  id: number,
): Promise<FetchMovieCreditsResult> {
  const movieCreditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`;

  try {
    const res = await fetch(movieCreditsUrl, { cache: "force-cache" });

    if (!res.ok) {
      return {
        title: `API 오류 (${res.status})`,
        errorMessage: `영화 크레딧을 불러오는 데 실패했습니다: ${res.statusText}`,
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
