"use client";

import { useEffect, useState } from "react";
import { Movie } from "api/fetchNowPlayingMovies";
import { fetchSimilarMovies } from "api/fetchSimilarMovies";
import { useError } from "store/error-context";
import TicketSwiper from "app/ticket-swiper";

export default function SimilarMovies({ movieId }: { movieId: number }) {
  const [similarMovies, setSimilarMovies] = useState<Movie[]>();
  const { isShowError } = useError();

  useEffect(() => {
    const fetchMovies = async () => {
      const result = await fetchSimilarMovies(movieId);

      if ("results" in result) {
        setSimilarMovies(result.results);
      } else {
        isShowError(result.title, result.errorMessage, result.status);
      }
    };

    fetchMovies();
  }, [movieId, isShowError]);

  return (
    <>
      {similarMovies && (
        <section className="p-4 lg:p-8">
          <h2 className="mb-6 text-2xl font-bold">이런 영화는 어때요?</h2>
          <TicketSwiper movieList={similarMovies} />
        </section>
      )}
    </>
  );
}
