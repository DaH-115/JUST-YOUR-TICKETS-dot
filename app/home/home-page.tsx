"use client";

import React, { useMemo } from "react";
import { Movie } from "api/fetchNowPlayingMovies";
import dynamic from "next/dynamic";
import Loading from "app/loading";
import getMovieTitle from "app/utils/get-movie-title";
import BackGround from "app/ui/layout/back-ground";
import RecommendMovie from "app/home/recommend-movie";
import RecommendMovieSkeleton from "app/home/recommend-movie-skeleton";
import ScrollToTopButton from "app/ui/scroll-to-top-button";
import Catchphrase from "app/ui/layout/catchphrase";

interface HomePageProps {
  movieList: Movie[];
  trailerKey: string;
  currentMovie: Movie;
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

  const MovieTrailer = dynamic(() => import("app/home/movie-trailer"), {
    loading: () => <Loading />,
  });

  const NowPlayingList = dynamic(() => import("app/home/now-playing-list"), {
    loading: () => <Loading />,
    ssr: false,
  });

  return (
    <>
      {currentMovie.backdrop_path && (
        <BackGround
          imageUrl={currentMovie.backdrop_path}
          movieTitle={movieTitle}
        />
      )}
      {/* Recommend Movie */}
      {currentMovie ? (
        <RecommendMovie
          currentMovie={memoizedCurrentMovie}
          trailerKey={memoizedTrailerKey}
        />
      ) : (
        <RecommendMovieSkeleton />
      )}
      {/* Movie Trailer */}
      {memoizedTrailerKey && <MovieTrailer trailerKey={memoizedTrailerKey} />}
      {/* Now Playing List */}
      <NowPlayingList movieList={memoizedMovieList} />
      {/* Catchphrase */}
      <Catchphrase />
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </>
  );
}
