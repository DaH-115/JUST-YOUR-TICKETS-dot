export interface MovieDetails {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string }[];
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
    { cache: "force-cache" },
  );

  if (!res.ok) {
    throw {
      status: res.status,
      message:
        res.status === 404
          ? "영화를 찾을 수 없습니다."
          : "영화 정보를 불러오는데 실패했습니다.",
    };
  }

  const data = await res.json();
  return data;
}
