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
  cast: CastMember[];
  crew: CrewMember[];
}

export async function fetchMovieCredits(id: number): Promise<MovieCredits> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error("TMDB API 키가 설정되지 않았습니다.");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=ko-KR`,
    { next: { revalidate: 86400 } }, // 24시간 캐시
  );

  if (!response.ok) {
    throw new Error("영화 출연진 정보를 불러올 수 없습니다.");
  }

  const data = await response.json();
  return data;
}
