import { MovieBaseType } from "api/fetchNowPlayingMovies";

export interface MovieDetails extends MovieBaseType {
  genres: { id: number; name: string }[];
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error("TMDB API 키가 설정되지 않았습니다.");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=ko-KR`,
    { cache: "force-cache" },
  );

  if (!response.ok) {
    throw new Error("영화 상세 정보를 불러올 수 없습니다.");
  }

  const data = await response.json();
  return data;
}
