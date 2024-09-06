export async function fetchMovieCredits(id: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
    );
    const posts = await res.json();

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    return posts;
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    return [];
  }
}
