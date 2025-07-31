"use client";

import MoviePoster from "app/components/movie/MoviePoster";
import VideoPlayer from "app/components/movie/VideoPlayer";
import Background from "app/components/ui/layout/Background";
import MovieInfoCard from "app/home/components/MovieInfoCard";
import getMovieTitle from "app/utils/getMovieTitle";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { useLayoutEffect, useMemo, useState } from "react";

interface RecommendSectionProps {
  movie: MovieList;
  trailerKey?: string;
}

export default function RecommendSection({
  movie,
  trailerKey,
}: RecommendSectionProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  const movieTitle = useMemo(
    () => getMovieTitle(movie.original_title, movie.title),
    [movie],
  );

  useLayoutEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden py-8">
      {movie?.backdrop_path && (
        <Background imageUrl={movie.backdrop_path} isFixed={true} />
      )}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-6xl">
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
            className={`mx-auto flex w-full max-w-4xl flex-col items-center gap-4 transition-transform duration-300 ease-in-out md:flex-row md:items-start md:gap-6 lg:hover:scale-105 ${
              isHydrated
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="aspect-[2/3] w-60 overflow-hidden rounded-2xl md:w-72 lg:w-80">
              <MoviePoster posterPath={movie.poster_path} title={movieTitle} />
            </div>

            <div className="flex-1">
              <MovieInfoCard movie={movie} />
            </div>
          </div>

          {trailerKey && (
            <section
              className={`w-full pt-16 transition-all duration-500 ease-out ${
                isHydrated
                  ? "translate-y-0 opacity-100 transition-delay-700"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <header className="mb-8">
                <div className="mb-2 flex items-center justify-center space-x-3 md:justify-start">
                  <h2 className="bg-gradient-to-r from-white via-accent-200 to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
                    Movie Trailer
                  </h2>
                </div>
                <p className="text-center text-base text-gray-300 md:text-left">
                  이 영화의 예고편을 확인해보세요
                </p>
              </header>

              <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-xl">
                <VideoPlayer trailerKey={trailerKey} thumbnailSize={"large"} />
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
