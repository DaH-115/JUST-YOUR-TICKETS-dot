import { MovieList } from "api/fetchNowPlayingMovies";
import { fetchGenres } from "api/utils/get-genres";

export async function fetchSimilarMovies(id: number): Promise<MovieList[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
    { cache: "force-cache" },
  );

  if (!res.ok) {
    throw {
      status: res.status,
      message:
        res.status === 404
          ? "비슷한 영화를 찾을 수 없습니다."
          : "비슷한 영화를 불러오는데 실패했습니다.",
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
