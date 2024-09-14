"use client";

import { useEffect, useState } from "react";
import { Movie } from "app/page";
import Image from "next/image";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import ScrollToTopButton from "app/ui/ScrollToTopButton";
import MovieCard from "app/ui/movie-card";
import TicketSwiper from "app/ticket-swiper";

export default function HomePage({ movieList }: { movieList: Movie[] }) {
  const [trailerKey, setTrailerKey] = useState<string>("");
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (movieList.length > 0) {
      const newIndex = Math.floor(Math.random() * movieList.length);
      setCurrentMovie(movieList[newIndex]);
    }
  }, [movieList]);

  useEffect(() => {
    if (!currentMovie) return;

    const fetchTrailer = async () => {
      setTrailerKey("");
      try {
        const posts = await fetchVideosMovies(currentMovie.id);

        if (posts && posts.length > 0) {
          setTrailerKey(posts[0].key);
        } else {
          console.log("Not found for this movie");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTrailer();
  }, [currentMovie]);

  return (
    <>
      <div
        id="catchphrase"
        className="fixed left-0 right-0 top-16 z-0 mx-auto hidden text-center font-bold md:top-20 md:block md:text-2xl"
      >
        Make a ticket for your own movie review.
      </div>
      <main className="relative z-10 mx-auto mb-10 mt-20 md:w-1/2">
        {/* TRAILER */}
        <div className="flex w-full items-center justify-center">
          {trailerKey ? (
            <section className="aspect-video w-1/2">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${currentMovie?.original_title} Trailer`}
                className="h-full w-full"
              />
            </section>
          ) : null}
          {/* POSTER */}
          {currentMovie?.poster_path ? (
            <section className="w-1/2">
              <Image
                className="h-full w-full object-cover"
                src={`https://image.tmdb.org/t/p/original${currentMovie?.poster_path}`}
                alt={`${currentMovie?.title}(${currentMovie?.original_title})`}
                width={640}
                height={750}
                priority
              />
            </section>
          ) : null}
        </div>
        {/* MOVIE CARD */}
        {currentMovie ? <MovieCard movie={currentMovie} /> : "Loading..."}
      </main>
      <div className="relative z-10 px-6">
        <div className="mb-4 text-5xl font-bold">Now Playing</div>
        <p className="text-sm">현재 가장 인기 있는 영화들을 확인해 보세요</p>
        {/* POSTER SWIPER */}
        <TicketSwiper movieList={movieList} />
      </div>
      {/* Scroll To Top Button */}
      <ScrollToTopButton />
    </>
  );
}
