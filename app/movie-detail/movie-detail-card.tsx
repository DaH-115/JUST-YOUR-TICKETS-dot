"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Movie } from "api/fetchNowPlayingMovies";
import { MovieCredits } from "api/fetchMovieCredits";
import useFormatDate from "hooks/useFormatDate";
import useGetTitle from "hooks/useGetTitle";
import { IoStar } from "react-icons/io5";
import { ErrorResponse } from "api/error-type";
import { useError } from "store/error-context";
import MovieDetailCardSkeleton from "app/movie-detail/movie-detail-card-skeleton";
import NewWriteBtn from "app/ui/new-write-btn";

type MovieDetailCardProps = {
  movieDetails: Movie | ErrorResponse;
  movieCredits: MovieCredits | ErrorResponse;
};

export default function MovieDetailCard({
  movieDetails,
  movieCredits,
}: MovieDetailCardProps) {
  const { isShowError } = useError();

  const isErrorResponse = (response: any): response is ErrorResponse => {
    return "errorMessage" in response;
  };

  useEffect(() => {
    // movieDetails나 movieCredits 중 하나라도 에러인 경우
    const errorData = isErrorResponse(movieDetails)
      ? movieDetails
      : isErrorResponse(movieCredits)
        ? movieCredits
        : null;

    if (errorData) {
      isShowError(errorData.title, errorData.errorMessage, errorData.status);
    }
  }, [movieDetails, movieCredits, isShowError]);

  if (
    !movieDetails ||
    !movieCredits ||
    "errorMessage" in movieDetails ||
    "errorMessage" in movieCredits
  ) {
    return <MovieDetailCardSkeleton />;
  }

  const movieTitle = useGetTitle(
    movieDetails.original_title,
    movieDetails.title,
  );
  const movieDate = useFormatDate(movieDetails.release_date);
  const movieCasts = movieCredits.cast || [];
  const movieCrews = movieCredits.crew || [];
  const convertRuntime = (runtime: number) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}시간 ${minutes}분`;
  };

  return (
    <main className="relative mb-8 flex w-full items-center justify-center lg:my-8">
      <div className="flex flex-col justify-center lg:w-2/3 lg:flex-row">
        {/* MOVIE POSTER */}
        <section className="mx-auto w-3/4 py-4 lg:mr-8 lg:w-2/3 lg:py-0">
          {movieDetails.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`}
              alt={movieTitle}
              width={1280}
              height={720}
              className="rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div
              className="h-full w-full animate-pulse rounded-lg bg-gray-300 shadow-lg"
              style={{ aspectRatio: "2/3" }}
            />
          )}
        </section>
        {/* MOVIE INFO */}
        <section className="mx-auto w-full rounded-xl border-2 border-black bg-white shadow-lg">
          <div className="p-4 pb-2">
            <h1 className="mb-2 inline-block rounded-lg bg-black p-1 text-xs font-bold text-white">
              영화 정보
            </h1>
            <h2 className="break-keep text-2xl font-bold lg:text-3xl">
              {movieDetails.title}
            </h2>
            <div className="flex items-center">
              <p className="text-sm text-gray-500 lg:text-base">
                {movieDetails.original_title}
              </p>
              <p className="text-lg text-gray-500">
                <span className="px-2">•</span>
                {movieDetails.release_date.slice(0, 4)}
              </p>
            </div>
          </div>
          <div className="border-y border-black p-2">
            <ul className="flex items-center space-x-2 overflow-x-scroll scrollbar-hide">
              {movieDetails.genres.map((genre) => (
                <li
                  key={genre.id}
                  className="rounded-full border-2 border-black bg-black px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-white hover:text-black active:bg-white active:text-black lg:text-xs"
                >
                  {genre.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 font-bold">
            <div className="flex items-center text-2xl md:text-4xl">
              <IoStar className="mr-2" />
              <p className="text-2xl md:text-4xl">
                {movieDetails
                  ? Math.round(movieDetails.vote_average * 10) / 10
                  : 0}
                <span className="font-normal text-gray-400">/10</span>
              </p>
            </div>
          </div>
          {movieDetails.overview && (
            <div className="mb-12 mt-2">
              <p className="break-keep px-6 font-light">
                {movieDetails.overview}
              </p>
            </div>
          )}
          <div className="border-t border-black p-2">
            <h3 className="text-xs font-bold md:text-sm">출연진</h3>
            <ul className="space-y-1 p-4">
              {Array.isArray(movieCasts) &&
                movieCasts.slice(0, 5).map((cast) => (
                  <li key={cast.id} className="text-sm">
                    {cast.name}
                  </li>
                ))}
            </ul>
          </div>
          <div className="flex w-full items-stretch justify-between border-t border-black text-xs md:text-sm">
            <div className="flex flex-1 flex-col">
              <h3 className="p-2 pb-0 font-bold">개봉일</h3>
              <div className="overflow-y-auto px-2 py-4 text-center">
                <p className="break-keep">{movieDate}</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col border-x-2 border-dotted border-gray-300 text-xs md:text-sm">
              <h3 className="p-2 pb-0 font-bold">러닝 타임</h3>
              <div className="overflow-y-auto px-2 py-4 text-center">
                <p>{convertRuntime(Number(movieDetails.runtime))}</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <h3 className="p-2 pb-0 text-xs font-bold md:text-sm">감독</h3>
              <div className="overflow-y-auto px-2 py-4 text-center">
                <ul className="space-y-1">
                  {movieCrews
                    .filter((crew) => crew.job === "Director")
                    .map((crew) => (
                      <li key={crew.id}>{crew.name}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center border-y border-black p-4">
            <h3 className="text-xs font-bold md:text-sm">제작</h3>
            <div className="ml-4 space-y-1 text-sm">
              {movieDetails.production_companies.map((company, index) => (
                <div key={index}>
                  <span>{company.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="group flex w-full p-1 text-center text-white">
            <NewWriteBtn movieId={movieDetails.id} size="lg" />
          </div>
        </section>
      </div>
    </main>
  );
}
