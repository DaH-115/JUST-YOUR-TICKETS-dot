"use client";

import { useEffect, useState } from "react";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import { Movie } from "api/fetchNowPlayingMovies";
import { ErrorResponse } from "api/error-type";
import useGetTitle from "hooks/useGetTitle";
import { useError } from "store/error-context";
import BackGround from "app/ui/back-ground";
import RecommendMovie from "app/home/recommend-movie";
import RecommendMovieSkeleton from "app/home/recommend-movie-skeleton";
import MovieTrailer from "app/home/movie-trailer";
import NowPlayingList from "app/home/now-playing-list";
import ScrollToTopButton from "app/ui/scroll-to-top-button";
import Catchphrase from "app/ui/catchphrase";

export default function HomePage({
  movieList,
}: {
  movieList: Movie[] | ErrorResponse;
}) {
  const [trailerKey, setTrailerKey] = useState<string>("");
  const [currentMovie, setCurrentMovie] = useState<Movie>();
  const movieTitle = useGetTitle(
    currentMovie?.original_title,
    currentMovie?.title,
  );
  const { isShowError } = useError();

  useEffect(() => {
    if ("errorMessage" in movieList) {
      isShowError(movieList.title, movieList.errorMessage, movieList.status);
    }
  }, [movieList, isShowError]);

  useEffect(() => {
    if (Array.isArray(movieList) && movieList.length > 0) {
      const randomIndex = Math.floor(Math.random() * movieList.length);
      setCurrentMovie(movieList[randomIndex]);
    }
  }, [movieList]);

  useEffect(() => {
    if (!currentMovie) return;
    setTrailerKey("");

    const fetchTrailer = async () => {
      const trailerData = await fetchVideosMovies(currentMovie.id);

      if ("results" in trailerData) {
        setTrailerKey(trailerData.results[0]?.key);
      } else {
        isShowError(
          trailerData.title,
          trailerData.errorMessage,
          trailerData.status,
        );
      }
    };

    fetchTrailer();
  }, [currentMovie, isShowError]);

  return (
    <div className="min-w-[320px]">
      <BackGround
        imageUrl={currentMovie?.backdrop_path}
        movieTitle={movieTitle}
      />
      {/* Recommend Movie */}
      {currentMovie ? (
        <RecommendMovie currentMovie={currentMovie} trailerKey={trailerKey} />
      ) : (
        <RecommendMovieSkeleton />
      )}
      {/* Movie Trailer */}
      {trailerKey && (
        <MovieTrailer trailerKey={trailerKey} movieTitle={movieTitle} />
      )}
      {/* Now Playing */}
      {Array.isArray(movieList) && movieList.length > 0 && (
        <NowPlayingList movieList={movieList} />
      )}
      <ScrollToTopButton />
      <Catchphrase />
    </div>
  );
}
