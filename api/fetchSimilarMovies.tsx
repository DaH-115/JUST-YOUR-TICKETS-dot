import { Movie } from "app/page";

export async function fetchSimilarMovies(id: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
      { cache: "force-cache" },
    );

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    const data = await res.json();
    return data.results as Movie[];
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    return;
  }
}
