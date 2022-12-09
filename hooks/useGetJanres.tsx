import { useState, useEffect } from 'react';
import axios from 'axios';
import { SystemError } from 'errorType';
import Error from 'next/error';

const useGetJanres = (movieId: number) => {
  const [janre, setJanre] = useState<string[]>([]);

  useEffect(() => {
    if (movieId) {
      try {
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
      } catch (error) {
        const err = error as SystemError;
        <Error statusCode={err.statusCode} />;
      }
    }
  }, [movieId]);

  return janre;
};

export default useGetJanres;
