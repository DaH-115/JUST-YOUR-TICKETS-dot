"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import useGetTitle from "hooks/useGetTitle";
import BackGround from "app/ui/back-ground";
import ScrollToTopButton from "app/ui/scroll-to-top-button";
import MovieCard from "app/ui/movie-card";
import TicketSwiper from "app/ticket-swiper";
import { Movie } from "app/page";
import Catchphrase from "app/ui/catchphrase";
import ScrollButton from "./ui/scroll-button";
import { MdLocalMovies } from "react-icons/md";
import { RiMovieLine } from "react-icons/ri";

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
      <>
        {currentMovie ? (
          <>
            <main className="relative z-10 mx-32 mb-12 mt-16 flex items-center justify-center">
              {/* MOVIE CARD */}
              <div className="w-3/5">
                {currentMovie && <MovieCard movie={currentMovie} />}
              </div>

              {currentMovie?.poster_path && (
                <div className="relative w-1/3 pl-8">
                  <div className="group">
                    <Image
                      className="h-full w-full transform object-cover drop-shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
                      src={`https://image.tmdb.org/t/p/original${currentMovie?.poster_path}`}
                      alt={movieTitle}
                      width={640}
                      height={750}
                      priority
                    />
                  </div>
                  <div className="absolute -right-24 top-0 flex-row">
                    <div className="group relative">
                      <ScrollButton targetId="trailer-movie">
                        <RiMovieLine size={24} />
                      </ScrollButton>
                      <div className="invisible absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-black px-3 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
                        영화 예고편 보기
                      </div>
                    </div>
                    <div className="group relative">
                      <ScrollButton targetId="now-playing">
                        <MdLocalMovies size={24} />
                      </ScrollButton>
                      <div className="invisible absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-black px-3 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
                        현재 상영하는 영화 보기
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </>
        ) : (
          <div className="flex h-screen items-center justify-center">
            <div className="text-4xl font-bold">Loading...</div>
          </div>
        )}
      </>
      <>
        {trailerKey && (
          <section id="trailer-movie" className="relative z-10 p-8">
            <div className="group relative top-10 z-40 inline-block w-80">
              <div className="mb-6 h-32 w-80 rounded-xl border-2 border-black bg-white transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
                <div className="flex h-20 items-center border-b border-black">
                  <h2 className="flex h-full flex-1 items-center border-r border-black pl-4 text-4xl font-bold">
                    Trailer Movie
                  </h2>
                  <div
                    id="icon"
                    className="flex items-center justify-center p-4"
                  >
                    <RiMovieLine size={36} />
                  </div>
                </div>
                <p className="p-2 px-4 text-black">
                  이 영화의 예고편을 확인해 보세요
                </p>
              </div>
              <div className="absolute left-1 top-1 -z-10 h-32 w-80 rounded-xl border-2 border-black bg-black transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1"></div>
            </div>
            <div className="mx-auto aspect-video w-full max-w-6xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${currentMovie?.original_title} Trailer`}
                className="h-full w-full"
              />
            </div>
          </section>
        )}
      </>

      {/* Now Playing */}
      <section
        id="now-playing"
        className="relative z-10 mb-16 w-full px-8 pt-8"
      >
        <div className="group relative inline-block w-80">
          <div className="mb-6 h-32 w-80 rounded-xl border-2 border-black bg-white transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
            <div className="flex h-20 items-center border-b border-black">
              <h2 className="flex h-full flex-1 items-center border-r border-black pl-4 text-4xl font-bold">
                Now Playing
              </h2>
              <div id="icon" className="flex items-center justify-center p-4">
                <MdLocalMovies size={36} />
              </div>
            </div>
            <p className="p-2 px-4 text-black">
              현재 상영 중인 영화들을 확인해 보세요
            </p>
          </div>
          <div className="absolute left-1 top-1 -z-10 h-32 w-80 rounded-xl border-2 border-black bg-black transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1"></div>
        </div>
        {/* POSTER SWIPER */}
        <TicketSwiper movieList={movieList} />
      </section>

      <ScrollToTopButton />
      <Catchphrase />
    </>
  );
}
