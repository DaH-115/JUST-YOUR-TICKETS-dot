"use client";

import { memo } from "react";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import TicketSwiper from "app/components/swiper/ticket-swiper";

interface MovieSectionProps {
  title: string;
  description: string;
  movieList: MovieList[];
  maxItems?: number;
}

function MovieSection({
  title,
  description,
  movieList,
  maxItems = 10,
}: MovieSectionProps) {
  const slicedMovieList = movieList.slice(0, maxItems);

  return (
    <section className="py-8">
      {/* SECTION TITLE */}
      <div className="mb-4 text-white">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm">{description}</p>
      </div>
      {/* SECTION CONTENTS */}
      <TicketSwiper movieList={slicedMovieList} />
    </section>
  );
}

export default memo(MovieSection);
