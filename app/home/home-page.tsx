"use client";

import React, { useMemo } from "react";
import { MovieList } from "api/fetchNowPlayingMovies";
import dynamic from "next/dynamic";
import Loading from "app/loading";
import getMovieTitle from "app/utils/get-movie-title";
import BackGround from "app/ui/layout/back-ground";
import RecommendMovie from "app/home/recommend-movie";
import ScrollToTopButton from "app/components/scroll-to-top-button";
import Catchphrase from "app/ui/layout/catchphrase";
import { FaArrowRight } from "react-icons/fa";

interface HomePageProps {
  movieList: MovieList[];
  currentMovie: MovieList;
  trailerKey: string;
}

export default function HomePage({
  movieList,
  trailerKey,
  currentMovie,
}: HomePageProps) {
  const memoizedMovieList = useMemo(() => movieList, [movieList]);
  const memoizedTrailerKey = useMemo(() => trailerKey, [trailerKey]);
  const memoizedCurrentMovie = useMemo(() => currentMovie, [currentMovie]);
  const movieTitle = useMemo(
    () => getMovieTitle(currentMovie?.original_title, currentMovie?.title),
    [currentMovie],
  );

  const NowPlayingList = dynamic(() => import("app/home/now-playing-list"), {
    loading: () => <Loading />,
  });

  const MovieTrailer = dynamic(() => import("app/home/movie-trailer"), {
    loading: () => <Loading />,
  });

  return (
    <>
      {currentMovie?.backdrop_path && (
        <BackGround
          imageUrl={currentMovie.backdrop_path}
          movieTitle={movieTitle}
        />
      )}
      <main>
        <h1 className="mt-8 px-8 text-5xl font-bold text-accent-300 md:mt-16">
          {"JUST YOUR TICKETS."}
        </h1>
        <p className="mt-4 px-8 text-white">
          당신만의 영화 리뷰 티켓을 만들어보세요.
        </p>
        <NowPlayingList movieList={memoizedMovieList} />
        {currentMovie && <RecommendMovie currentMovie={memoizedCurrentMovie} />}
        {memoizedTrailerKey && <MovieTrailer trailerKey={memoizedTrailerKey} />}
      </main>
      <Catchphrase />
      <ScrollToTopButton />
    </>
  );
}
