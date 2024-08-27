import { useState, useEffect } from "react";
import axios from "axios";

const useGetGenres = (movieId: number) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`,
        );
        const data = res.data;

        const result = data.genres.map(
          (item: { id: number; name: string }) => item.name,
        );

        setGenres(result);
        setLoading(false);
      } catch (error) {
        setError("Error fetching genres");
        setLoading(false);
      }
    };

    fetchGenres();
  }, [movieId]);

  return { genres, loading, error };
};

export default useGetGenres;
