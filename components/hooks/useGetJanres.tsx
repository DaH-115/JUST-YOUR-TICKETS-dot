import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetJanres = (movieId: number) => {
  const [janres, setJanres] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`
      );
      const data = await res.data;

      const result = data.genres.map(
        (item: { id: number; name: string }) => item.name
      );

      setJanres(result);
    })();
  }, [movieId]);

  return janres;
};

export default useGetJanres;
