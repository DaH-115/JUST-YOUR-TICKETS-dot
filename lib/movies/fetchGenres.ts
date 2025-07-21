import { cache } from "react";

interface GenreResponse {
  genres: { id: number; name: string }[];
}

interface GenreMap {
  [key: number]: string;
}

// cache: 데이터를 메모리에 저장하여 데이터를 빠르게 가져올 수 있도록 합니다.
export const fetchGenres = cache(async (): Promise<GenreMap> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=ko`,
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
});
