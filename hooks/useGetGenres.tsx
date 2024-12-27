import { useState, useEffect, useCallback } from "react";
import { fetchMovieDetails } from "api/fetchMovieDetails";

const useGetGenres = (movieId: number) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenres = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchMovieDetails(movieId);
      setGenres(response.genres.map((genre) => genre.name));
    } catch (error) {
      setGenres([]);

      if (error && typeof error === "object" && "message" in error) {
        setError(error.message as string);
      } else {
        setError("장르 정보를 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  return { genres, loading, error };
};

export default useGetGenres;
