import { useMemo } from "react";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import getMovieTitle from "app/utils/getMovieTitle";
import MovieInfoCard from "app/home/components/MovieInfoCard";
import MoviePoster from "app/components/MoviePoster";
import VideoPlayer from "app/components/VideoPlayer";

interface HeroSectionProps {
  movie: MovieList;
  trailerKey?: string;
}

export default function HeroSection({ movie, trailerKey }: HeroSectionProps) {
  const movieTitle = useMemo(
    () => getMovieTitle(movie.original_title, movie.title),
    [movie],
  );

  return (
    <section className="relative min-h-screen">
      {movie?.backdrop_path && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            zIndex: -1,
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center px-3 pb-12 pt-16 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          {/* MOVIE PICK SECTION */}
          <div className="mb-16">
            {/* SECTION TITLE */}
            <div className="pb-10 md:pb-8">
              <div className="mb-2 flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-accent-300"></div>
                  <div className="h-2 w-2 rounded-full bg-accent-300"></div>
                  <div className="h-2 w-2 rounded-full bg-accent-300"></div>
                  <div className="h-2 w-2 rounded-full bg-accent-300"></div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Recommend Movie
                </h2>
              </div>
              <p className="ml-14 text-base text-gray-300">오늘의 추천 영화</p>
            </div>

            {/* SECTION CONTENTS */}
            <div className="flex w-full justify-center">
              <div className="flex w-full max-w-4xl flex-col gap-4 md:flex-row md:gap-4">
                {/* MOVIE POSTER */}
                <div className="aspect-[2/3] flex-none overflow-hidden rounded-2xl drop-shadow">
                  <MoviePoster
                    posterPath={movie.poster_path}
                    title={movieTitle}
                    size={500}
                  />
                </div>

                {/* MOVIE INFO CARD */}
                <div className="h-full flex-1">
                  <MovieInfoCard movie={movie} />
                </div>
              </div>
            </div>
          </div>

          {/* TRAILER SECTION */}
          {trailerKey && (
            <div className="w-full">
              {/* TRAILER TITLE */}
              <div className="pb-6 md:pb-8">
                <div className="mb-2 flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-accent-300"></div>
                    <div className="h-2 w-2 rounded-full bg-accent-300"></div>
                    <div className="h-2 w-2 rounded-full bg-accent-300"></div>
                    <div className="h-2 w-2 rounded-full bg-accent-300"></div>
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Movie Trailer
                  </h3>
                </div>
                <p className="ml-14 text-base text-gray-300">
                  이 영화의 예고편을 확인해보세요
                </p>
              </div>

              {/* TRAILER CONTENT */}
              <div className="flex justify-center">
                <div className="aspect-video w-full max-w-4xl">
                  <VideoPlayer
                    trailerKey={trailerKey}
                    thumbnailSize={"large"}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
