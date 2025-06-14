import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { fetchGenres } from "lib/movies/fetchGenres";

export async function fetchTrendingMovies(): Promise<MovieList[]> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error("TMDB API 키가 설정되지 않았습니다.");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=ko-KR`,
    { next: { revalidate: 3600 } }, // 1시간마다 재검증
  );

  if (!response.ok) {
    throw new Error("트렌딩 영화를 불러올 수 없습니다.");
  }

  const data = await response.json();
  const genreMap = await fetchGenres();

  const moviesWithGenres = data.results.map((movie: MovieList) => ({
    ...movie,
    genres: movie.genre_ids.map((genreId) => genreMap[genreId]).filter(Boolean),
  }));

  return moviesWithGenres;
}
