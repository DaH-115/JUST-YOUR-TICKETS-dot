"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import useGetTitle from "hooks/useGetTitle";
import BackGround from "app/ui/back-ground";
import ScrollToTopButton from "app/ui/ScrollToTopButton";
import MovieCard from "app/ui/movie-card";
import TicketSwiper from "app/ticket-swiper";
import { Movie } from "app/page";

export default function HomePage({ movieList }: { movieList: Movie[] }) {
  const [trailerKey, setTrailerKey] = useState<string>("");
  const [currentMovie, setCurrentMovie] = useState<Movie>();
  const movieTitle = useGetTitle(
    currentMovie?.original_title,
    currentMovie?.title,
  );

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
      <BackGround
        imageUrl={currentMovie?.backdrop_path}
        movieTitle={movieTitle}
      />
      <main className="relative z-10 mx-auto mb-20 mt-32 md:w-1/2">
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
                alt={movieTitle}
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
      <div className="relative z-10 mb-20 px-6">
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
