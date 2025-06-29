import { fetchGenres } from "lib/movies/fetchGenres";
import {
  fetchMovieReleaseDates,
  getBestRating,
} from "lib/movies/fetchMovieReleaseDates";

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
  rating?: string | null;
}

export async function fetchNowPlayingMovies(): Promise<MovieList[]> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error("TMDB API 키가 설정되지 않았습니다.");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&include_adult=true&language=ko-KR`,
    {
      next: { revalidate: 86400 }, // 24시간(86400초) 간격으로 재검증
    },
  );

  if (!response.ok) {
    throw new Error("상영 중인 영화를 불러올 수 없습니다.");
  }

  const data = await response.json();
  const genreMap = await fetchGenres();

  // 등급 정보도 포함
  const movieListwithGenres = await Promise.all(
    data.results.map(async (movie: MovieList) => {
      let rating = null;
      try {
        const releaseDates = await fetchMovieReleaseDates(movie.id);
        rating = getBestRating(releaseDates);
      } catch {
        rating = null;
      }
      return {
        ...movie,
        genres: movie.genre_ids
          .map((genreId) => genreMap[genreId])
          .filter(Boolean),
        rating,
      };
    }),
  );

  return movieListwithGenres;
}
