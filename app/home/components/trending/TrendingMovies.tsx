"use client";

import { memo } from "react";
import { MovieList } from "api/fetchNowPlayingMovies";
import TicketSwiper from "app/components/swiper/ticket-swiper";

function TrendingMovies({ trendingMovies }: { trendingMovies: MovieList[] }) {
  const slicedTrendingMovies = trendingMovies.slice(0, 10);

  return (
    <section className="py-8">
      {/* SECTION TITLE */}
      <div className="mb-4 text-white">
        <h2 className="text-2xl font-bold">Trending Movies</h2>
        <p className="text-sm">{"요즘 뜨는 영화를 확인해보세요."}</p>
      </div>
      {/* SECTION CONTENTS */}
      <TicketSwiper movieList={slicedTrendingMovies} />
    </section>
  );
}

export default memo(TrendingMovies);
