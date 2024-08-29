"use client";

import { useEffect, useState } from "react";
import MovieCard from "./ui/movie-card";
import TicketSwiper from "./ticket-swiper";
import { Movie } from "./page";
import Image from "next/image";

export default function HomePage({ movieList }: { movieList: Movie[] }) {
  const [randomIndex, setRandomIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    if (movieList.length > 0) {
      setRandomIndex(Math.floor(Math.random() * movieList.length));
      setIsMounted(true);
    }
  }, [movieList.length]);

  useEffect(() => {
    if (randomIndex !== null) {
      const { id } = movieList[randomIndex];

      const fetchData = async () => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
            { cache: "force-cache" },
          );
          const posts = await res.json();

          setTrailerKey(posts.results[0].key);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [randomIndex, movieList]);

  if (randomIndex === null) {
    return <div>Loading...</div>;
  }

  const { original_title, poster_path, title } = movieList[randomIndex];

  return (
    <>
      <div className="fixed left-0 right-0 top-16 mx-auto hidden text-center font-bold md:top-20 md:block md:text-2xl">
        Make a ticket for your own movie review.
      </div>
      {/* TO DO: 스타일링 수정 */}
      <main className="mx-auto mb-10 md:w-1/2">
        {/* TRAILER */}
        <div className="flex w-full items-center justify-center">
          <section className="aspect-video w-1/2">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${original_title} Trailer`}
              className="h-full w-full"
            ></iframe>
          </section>
          {/* POSTER */}
          <section className="w-1/2">
            <Image
              className="h-full w-full object-cover"
              src={`https://image.tmdb.org/t/p/original${poster_path}`}
              alt={`${title}(${original_title})`}
              width={640}
              height={750}
            />
          </section>
        </div>
        {/* MOVIE CARD */}
        <MovieCard movie={movieList[randomIndex]} />
      </main>
      <div className="px-6">
        <div className="mb-4 text-5xl font-bold">Now Playing</div>
        <p className="text-sm">현재 가장 인기 있는 영화들을 확인해 보세요</p>
        {/* POSTER SWIPER */}
        <TicketSwiper movieList={movieList} />
      </div>
    </>
  );
}
