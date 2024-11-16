import { useState, useEffect, useCallback } from "react";
import { fetchMovieDetails } from "api/fetchMovieDetails";

const useGetGenres = (movieId: number) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenres = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await fetchMovieDetails(movieId);

    if ("errorMessage" in response) {
      setError(response.errorMessage);
    } else {
      setGenres(response.genres.map((genre) => genre.name));
    }

    setLoading(false);
  }, [movieId]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  return { genres, loading, error };
};

export default useGetGenres;
