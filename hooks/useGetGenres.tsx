import { useState, useEffect } from "react";
import { fetchMovieDetails } from "api/fetchMovieDetails";

const useGetGenres = (movieId: number) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchMovieDetails(movieId);
        setGenres(response.genres.map((genre) => genre.name));
      } catch (error) {
        setGenres([]);
        setError("장르 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [movieId]);

  return { genres, loading, error };
};

export default useGetGenres;
