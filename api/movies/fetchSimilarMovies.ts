import { MovieList } from "api/movies/fetchNowPlayingMovies";
import { fetchGenres } from "api/utils/getGenres";

export async function fetchSimilarMovies(id: number): Promise<MovieList[]> {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error("TMDB API 키가 설정되지 않았습니다.");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API_KEY}&language=ko-KR`,
    { cache: "force-cache" },
  );

  if (!response.ok) {
    throw new Error("비슷한 영화를 불러올 수 없습니다.");
  }

  const data = await response.json();
  const genreMap = await fetchGenres();

  const movieListwithGenres = data.results.map((movie: MovieList) => ({
    ...movie,
    genres: movie.genre_ids.map((genreId) => genreMap[genreId]).filter(Boolean),
  }));

  return movieListwithGenres;
}
