export interface MovieTrailer {
  id: string;
  name: string;
  key: string;
}

interface VideoResult {
  results: MovieTrailer[];
}

export async function fetchVideosMovies(id: number): Promise<VideoResult> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
    { cache: "force-cache" },
  );

  if (!res.ok) {
    throw {
      status: res.status,
      message:
        res.status === 404
          ? "영화 트레일러를 찾을 수 없습니다."
          : "영화 트레일러를 불러오는데 실패했습니다.",
    };
  }

  const data = await res.json();
  return { results: data.results };
}
