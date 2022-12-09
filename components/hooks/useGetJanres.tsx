import { useState, useEffect } from 'react';
import axios from 'axios';
import { SystemError } from 'errorType';
import Error from 'next/error';

const useGetJanres = (movieId: number) => {
  const [janres, setJanres] = useState<string[]>([]);

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

          setJanres(result);
        })();
      } catch (error) {
        const err = error as SystemError;
        <Error statusCode={err.statusCode} />;
      }
    }
  }, [movieId]);

  return janres;
};

export default useGetJanres;
