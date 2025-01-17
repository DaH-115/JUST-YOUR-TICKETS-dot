import { fetchGenres } from "app/utils/get-genres";

export interface MovieBaseType {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date: string;
  vote_average: number;
  runtime: string;
  production_companies: { id: number; name: string }[];
}

export interface MovieList extends MovieBaseType {
  genre_ids: number[];
  genres: string[];
}

export async function fetchNowPlayingMovies(): Promise<MovieList[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&include_adult=true&language=ko-KR`,
    {
      next: { revalidate: 86400 }, // 24시간(86400초) 간격으로 재검증
    },
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
  const genreMap = await fetchGenres();

  const movieListwithGenres = data.results.map((movie: MovieList) => ({
    ...movie,
    genres: movie.genre_ids.map((genreId) => genreMap[genreId]).filter(Boolean),
  }));

  return movieListwithGenres;
}
