"use client";

import { useMemo, useState, useLayoutEffect } from "react";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import getMovieTitle from "app/utils/getMovieTitle";
import MovieInfoCard from "app/home/components/MovieInfoCard";
import MoviePoster from "app/components/MoviePoster";
import VideoPlayer from "app/components/VideoPlayer";

interface HeroSectionProps {
  movie: MovieList;
  trailerKey?: string;
}

// 애니메이션 도트 컴포넌트 분리 (DOM 중복 제거)
const AnimatedDots = ({
  isHydrated,
  className = "",
}: {
  isHydrated: boolean;
  className?: string;
}) => (
  <div className={`flex space-x-1 ${className}`}>
    {Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`h-2 w-2 rounded-full bg-accent-300 ${
          isHydrated ? "animate-pulse" : ""
        }`}
        style={{
          animationDelay: isHydrated ? `${i * 200}ms` : "0ms",
        }}
      />
    ))}
  </div>
);

export default function HeroSection({ movie, trailerKey }: HeroSectionProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  const movieTitle = useMemo(
    () => getMovieTitle(movie.original_title, movie.title),
    [movie],
  );

  useLayoutEffect(() => {
    // 하이드레이션 완료 후 애니메이션 활성화
    setIsHydrated(true);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {movie?.backdrop_path && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            zIndex: -1,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20" />
        </div>
      )}

      {/* 데스크톱에서만 배경 애니메이션 표시 */}
      <div className="absolute inset-0 hidden overflow-hidden md:block">
        <div
          className={`absolute -left-4 -top-4 h-72 w-72 rounded-full bg-gradient-to-r from-accent-300/10 to-primary-500/10 blur-3xl ${
            isHydrated ? "animate-pulse" : ""
          }`}
        />
        <div
          className={`absolute -bottom-4 -right-4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl ${
            isHydrated ? "animate-pulse animation-delay-2000" : ""
          }`}
        />
        <div
          className={`absolute left-1/4 top-1/2 h-48 w-48 rounded-full bg-gradient-to-r from-pink-500/5 to-yellow-500/5 blur-2xl ${
            isHydrated ? "animate-bounce animation-delay-1000" : ""
          }`}
        />
      </div>

      <main className="relative z-10 flex min-h-screen items-center px-6 pb-8 pt-16 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <header className="md:mb-16">
            <div className="pb-10 md:pb-8">
              <div
                className={`duration-800 mb-2 flex items-center justify-center space-x-3 transition-all ease-out md:justify-start ${
                  isHydrated
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <AnimatedDots isHydrated={isHydrated} />
                <h1 className="bg-gradient-to-r from-white via-accent-200 to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
                  Recommend Movie
                </h1>
              </div>
              <p
                className={`duration-800 text-center text-base text-gray-300 transition-all ease-out md:ml-14 md:text-left ${
                  isHydrated
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: isHydrated ? "300ms" : "0ms" }}
              >
                오늘의 추천 영화
              </p>
            </div>

            <div
              className={`duration-800 flex w-full justify-center transition-all ease-out ${
                isHydrated
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: isHydrated ? "500ms" : "0ms" }}
            >
              <div className="group flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:items-start md:gap-4">
                <div className="aspect-[2/3] w-72 flex-none overflow-hidden rounded-2xl drop-shadow-2xl transition-all duration-500 ease-in-out hover:rotate-1 hover:scale-105 hover:drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] md:w-80 lg:w-96">
                  <div className="relative h-full w-full">
                    <span className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-100 transition-opacity duration-500 group-hover:opacity-0" />
                    <MoviePoster
                      posterPath={movie.poster_path}
                      title={movieTitle}
                    />
                  </div>
                </div>

                <div className="h-full flex-1 transition-all duration-500 ease-in-out md:hover:scale-105">
                  <div className="relative h-full">
                    <MovieInfoCard movie={movie} />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {trailerKey && (
            <section
              className={`duration-800 w-full transition-all ease-out ${
                isHydrated
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: isHydrated ? "700ms" : "0ms" }}
            >
              <header className="pb-6 md:pb-8">
                <div className="mb-2 flex items-center justify-center space-x-3 md:justify-start">
                  <AnimatedDots isHydrated={isHydrated} />
                  <h2 className="bg-gradient-to-r from-white via-accent-200 to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
                    Movie Trailer
                  </h2>
                </div>
                <p className="text-center text-base text-gray-300 md:ml-14 md:text-left">
                  이 영화의 예고편을 확인해보세요
                </p>
              </header>

              <div className="flex justify-center">
                <div className="group aspect-video w-full max-w-4xl transition-all duration-500 ease-out hover:scale-105">
                  <div className="relative h-full w-full">
                    <span className="absolute -inset-2 rounded-xl bg-white/10 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative h-full w-full overflow-hidden rounded-xl">
                      <VideoPlayer
                        trailerKey={trailerKey}
                        thumbnailSize={"large"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </section>
  );
}
