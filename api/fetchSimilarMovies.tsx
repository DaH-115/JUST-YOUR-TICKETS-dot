import { MovieList } from "api/fetchNowPlayingMovies";

export async function fetchSimilarMovies(
  id: number,
): Promise<{ results: MovieList[] }> {
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
  return { results: data.results };
}
