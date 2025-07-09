"use client";

import { useMemo, useState, useLayoutEffect } from "react";
import MoviePoster from "app/components/MoviePoster";
import VideoPlayer from "app/components/VideoPlayer";
import MovieInfoCard from "app/home/components/MovieInfoCard";
import Background from "app/ui/layout/Background";
import getMovieTitle from "app/utils/getMovieTitle";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";

interface HeroSectionProps {
  movie: MovieList;
  trailerKey?: string;
}

export default function HeroSection({ movie, trailerKey }: HeroSectionProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  const movieTitle = useMemo(
    () => getMovieTitle(movie.original_title, movie.title),
    [movie],
  );

  useLayoutEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {movie?.backdrop_path && (
        <Background imageUrl={movie.backdrop_path} isFixed={true} />
      )}
      <main className="relative z-10 flex min-h-screen items-center px-6 pb-8 pt-16 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <header className="md:mb-16">
            <div className="pb-10 md:pb-8">
              <div
                className={`mb-2 flex items-center justify-center space-x-3 transition-all duration-500 ease-out md:justify-start ${
                  isHydrated
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <h1 className="bg-gradient-to-r from-white via-accent-200 to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
                  Recommend Movie
                </h1>
              </div>
              <p
                className={`text-center text-base text-gray-300 transition-all duration-500 ease-out md:text-left ${
                  isHydrated
                    ? "translate-y-0 opacity-100 transition-delay-300"
                    : "translate-y-8 opacity-0"
                }`}
              >
                오늘의 추천 영화
              </p>
            </div>

            <div
              className={`mx-auto flex w-full max-w-4xl flex-col items-center gap-8 transition-all duration-500 ease-out md:flex-row md:items-start ${
                isHydrated
                  ? "translate-y-0 opacity-100 transition-delay-500"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="aspect-[2/3] w-60 overflow-hidden rounded-2xl transition-transform duration-300 ease-out hover:scale-105 md:w-72 lg:w-80">
                <MoviePoster
                  posterPath={movie.poster_path}
                  title={movieTitle}
                />
              </div>

              <div className="flex-1 transition-transform duration-300 ease-out hover:scale-105">
                <MovieInfoCard movie={movie} />
              </div>
            </div>
          </header>

          {trailerKey && (
            <section
              className={`w-full transition-all duration-500 ease-out ${
                isHydrated
                  ? "translate-y-0 opacity-100 transition-delay-700"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <header className="py-6 md:py-8">
                <div className="mb-2 flex items-center justify-center space-x-3 md:justify-start">
                  <h2 className="bg-gradient-to-r from-white via-accent-200 to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
                    Movie Trailer
                  </h2>
                </div>
                <p className="text-center text-base text-gray-300 md:text-left">
                  이 영화의 예고편을 확인해보세요
                </p>
              </header>

              <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-xl transition-transform duration-300 ease-out hover:scale-105">
                <VideoPlayer trailerKey={trailerKey} thumbnailSize={"large"} />
              </div>
            </section>
          )}
        </div>
      </main>
    </section>
  );
}
