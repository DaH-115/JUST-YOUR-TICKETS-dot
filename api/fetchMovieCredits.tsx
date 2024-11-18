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

export async function fetchMovieCredits(id: number): Promise<MovieCredits> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
    { cache: "force-cache" },
  );

  if (!res.ok) {
    throw {
      status: res.status,
      message:
        res.status === 404
          ? "영화 출연진 정보를 찾을 수 없습니다."
          : "영화 출연진 정보를 불러오는데 실패했습니다.",
    };
  }

  const data = await res.json();
  return data;
}
