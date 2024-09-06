import { useState, useEffect } from "react";
import { fetchMovieDetails } from "api/fetchMovieDetails";

const useGetGenres = (movieId: number) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const res = await fetchMovieDetails(movieId);
        const result = res.genres.map(
          (item: { id: number; name: string }) => item.name,
        );

        setGenres(result);
      } catch (error) {
        setError("Error fetching genres");
      }
      setLoading(false);
    };

    fetchGenres();
  }, [movieId]);

  return { genres, loading, error };
};

export default useGetGenres;
