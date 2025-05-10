import { NextRequest, NextResponse } from "next/server";
import { fetchGenres } from "lib/movies/fetchGenres";

export async function GET(req: NextRequest) {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query");
  const page = searchParams.get("page") ?? "1";

  if (!TMDB_API_KEY || !query) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query,
      )}&include_adult=true&language=ko-KR&page=${page}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "TMDB 검색 요청 실패" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const genreMap = await fetchGenres();

    const movieListWithGenres = data.results.map((movie: any) => ({
      ...movie,
      genres: movie.genre_ids.map((id: number) => genreMap[id]).filter(Boolean),
    }));

    return NextResponse.json({
      movies: movieListWithGenres,
      totalPages: data.total_pages,
    });
  } catch (error) {
    console.error("TMDB 검색 API 실패:", error);
    return NextResponse.json(
      { error: "서버 오류로 영화 검색에 실패했습니다." },
      { status: 500 },
    );
  }
}
