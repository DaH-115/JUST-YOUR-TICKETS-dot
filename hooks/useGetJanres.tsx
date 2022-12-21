import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetJanres = (movieId: number) => {
  const [janre, setJanre] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`
      );
      const data = await res.data;

      const result = data.genres.map(
        (item: { id: number; name: string }) => item.name
      );

      setJanre(result);
    })();
  }, [movieId]);

  return janre;
};

export default useGetJanres;
