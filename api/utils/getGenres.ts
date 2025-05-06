interface GenreResponse {
  genres: { id: number; name: string }[];
}

interface GenreMap {
  [key: number]: string;
}

export async function fetchGenres(): Promise<GenreMap> {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch genres");
  }

  const { genres } = (await res.json()) as GenreResponse;

  const genreMap = genres.reduce<GenreMap>((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});

  return genreMap;
}
