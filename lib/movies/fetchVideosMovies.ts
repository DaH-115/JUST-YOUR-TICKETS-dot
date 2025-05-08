export interface MovieTrailer {
  id: string;
  name: string;
  key: string;
}

interface VideoResult {
  results: MovieTrailer[];
}

export async function fetchVideosMovies(id: number): Promise<VideoResult> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error("TMDB API 키가 설정되지 않았습니다.");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=ko-KR`,
    { cache: "force-cache" },
  );

  if (!response.ok) {
    throw new Error("영화 트레일러를 불러올 수 없습니다.");
  }

  const data = await response.json();
  return { results: data.results };
}
