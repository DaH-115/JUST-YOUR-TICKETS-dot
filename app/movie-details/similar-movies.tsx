"use client";

import { useEffect, useState } from "react";
import { Movie } from "api/fetchNowPlayingMovies";
import { fetchSimilarMovies } from "api/fetchSimilarMovies";
import TicketSwiper from "app/ui/ticket-swiper";

export default function SimilarMovies({ movieId }: { movieId: number }) {
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { results } = await fetchSimilarMovies(movieId);
        setSimilarMovies(results);
      } catch (error) {
        console.error(error);
        setSimilarMovies([]);
        setIsError("비슷한 영화를 불러오는데 실패했습니다.");
      }
    };

    fetchMovies();
  }, [movieId]);

  return (
    <section className="px-8 py-4 lg:p-8">
      <h2 className="text-2xl font-bold text-white">이런 영화는 어때요?</h2>
      {similarMovies.length > 0 ? (
        <TicketSwiper movieList={similarMovies} />
      ) : (
        <div className="w-full text-gray-400">
          {isError ? isError : "비슷한 영화가 없습니다."}
        </div>
      )}
    </section>
  );
}
