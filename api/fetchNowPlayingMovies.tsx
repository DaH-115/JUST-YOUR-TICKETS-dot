export async function fetchNowPlayingMovies() {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&include_adult=true&language=ko-KR`,
      { cache: "force-cache" },
    );

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    return [];
  }
}
