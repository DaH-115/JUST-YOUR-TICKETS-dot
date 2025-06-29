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

const MovieSection = memo(function MovieSection({
  title,
  description,
  movieList,
  maxItems,
}: MovieSectionProps) {
  const displayMovies = maxItems ? movieList.slice(0, maxItems) : movieList;

  return (
    <section className="py-8 md:py-16">
      <div className="mb-6 md:mb-4">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
          {title}
        </h2>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
      <TicketSwiper movieList={displayMovies} />
    </section>
  );
});

export default MovieSection;
