import { MovieList } from "api/movies/fetchNowPlayingMovies";
import { fetchGenres } from "api/utils/getGenres";

interface SearchMovieResponse {
  movies: MovieList[];
  totalPages: number;
}

export default async function fetchSearchMovies(
  query: string,
  page: number = 1,
): Promise<SearchMovieResponse> {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error("TMDB API 키가 설정되지 않았습니다.");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&include_adult=true&language=ko-KR&page=${page}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("영화 검색 결과를 불러올 수 없습니다.");
  }

  const data = await response.json();
  const genreMap = await fetchGenres();

  const movieListwithGenres = data.results.map((movie: MovieList) => ({
    ...movie,
    genres: movie.genre_ids.map((genreId) => genreMap[genreId]).filter(Boolean),
  }));

  return { movies: movieListwithGenres, totalPages: data.total_pages };
}
