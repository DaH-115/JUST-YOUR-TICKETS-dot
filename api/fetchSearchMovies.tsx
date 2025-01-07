import { Movie } from "api/fetchNowPlayingMovies";

interface SearchResult {
  results: Movie[];
}

export async function fetchSearchMovies(query: string): Promise<SearchResult> {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&query=${query}&include_adult=true&language=ko-KR`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw {
      status: res.status,
      message:
        res.status === 404
          ? "검색 결과를 찾을 수 없습니다."
          : "영화 검색에 실패했습니다.",
    };
  }

  const data = await res.json();
  return { results: data.results };
}
