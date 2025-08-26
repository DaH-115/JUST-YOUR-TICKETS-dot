"use client";

import MoviePoster from "app/components/movie/MoviePoster";
import VideoPlayer from "app/components/movie/VideoPlayer";
import Background from "app/components/ui/layout/Background";
import MovieInfoCard from "app/home/components/MovieInfoCard";
import getMovieTitle from "app/utils/getEnrichMovieTitle";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { useEffect, useMemo, useRef, useState } from "react";

interface RecommendSectionProps {
  movie: MovieList;
  trailerKey?: string;
}

export default function RecommendSection({
  movie,
  trailerKey,
}: RecommendSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const movieTitle = useMemo(
    () => getMovieTitle(movie.original_title, movie.title),
    [movie],
  );

  useEffect(() => {
    // ref 값을 변수에 저장
    const currentSection = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 컴포넌트가 화면에 20% 이상 보일 때 애니메이션 시작
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 한 번 트리거되면 더 이상 관찰하지 않음
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2, // 20% 이상 보일 때 트리거
        rootMargin: "0px 0px -50px 0px", // 하단에서 50px 전에 트리거
      },
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden py-8"
    >
      {movie?.backdrop_path && (
        <Background imageUrl={movie.backdrop_path} isFixed={true} />
      )}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full">
          {/* 헤더 */}
          <header className="pb-8">
            <div
              className={`mb-2 flex items-center justify-center space-x-3 transition-all duration-500 ease-out md:justify-start ${
                isVisible
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
                isVisible
                  ? "translate-y-0 opacity-100 transition-delay-300"
                  : "translate-y-8 opacity-0"
              }`}
            >
              오늘의 추천 영화
            </p>
          </header>

          {/* 영화 포스터 & 정보 카드 */}
          <div
            className={`mx-auto transition-transform duration-300 ease-in-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="mx-auto max-w-md drop-shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-2xl">
              {/* 영화 포스터 */}
              <div className="aspect-[2/3] overflow-hidden rounded-2xl">
                <MoviePoster
                  posterPath={movie.poster_path}
                  title={movieTitle}
                />
              </div>

              {/* 영화 정보 카드 */}
              <MovieInfoCard movie={movie} />
            </div>
          </div>

          {trailerKey && (
            <section
              className={`w-full pt-16 transition-all duration-500 ease-out ${
                isVisible
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
