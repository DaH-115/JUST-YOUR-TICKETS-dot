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

interface MoviesResult {
  results: Movie[];
}

export async function fetchNowPlayingMovies(): Promise<MoviesResult> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&include_adult=true&language=ko-KR`,
  );

  if (!res.ok) {
    throw {
      status: res.status,
      message:
        res.status === 404
          ? "상영 중인 영화를 찾을 수 없습니다."
          : "상영 중인 영화 정보를 불러오는데 실패했습니다.",
    };
  }

  const data = await res.json();
  return { results: data.results };
}
