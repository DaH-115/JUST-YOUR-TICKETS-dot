"use client";

import { memo } from "react";
import { MovieList } from "api/movies/fetchNowPlayingMovies";
import TicketSwiper from "app/components/swiper/ticket-swiper";

function NowPlayingList({ movieList }: { movieList: MovieList[] }) {
  const slicedMovieList = movieList.slice(0, 10);

  return (
    <section className="py-8">
      {/* SECTION TITLE */}
      <div className="mb-4 text-white">
        <h2 className="text-2xl font-bold">Now Playing</h2>
        <p className="text-sm">{"티켓으로 만들 영화를 찾아보세요."}</p>
      </div>
      {/* SECTION CONTENTS */}
      <TicketSwiper movieList={slicedMovieList} />
    </section>
  );
}

export default memo(NowPlayingList);
