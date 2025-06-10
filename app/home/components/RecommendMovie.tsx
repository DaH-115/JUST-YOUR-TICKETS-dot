import { useMemo } from "react";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import getMovieTitle from "app/utils/getMovieTitle";
import MovieInfoCard from "app/home/components/MovieInfoCard";
import MoviePoster from "app/components/MoviePoster";

export default function RecommendMovie({
  currentMovie,
}: {
  currentMovie: MovieList;
}) {
  const movieTitle = useMemo(
    () => getMovieTitle(currentMovie.original_title, currentMovie.title),
    [currentMovie],
  );

  return (
    <section className="py-12 md:py-8">
      {/* SECTION TITLE */}
      <div className="pb-10 md:pb-8">
        <div className="mb-2 flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="h-2 w-2 rounded-full bg-accent-300"></div>
            <div className="h-2 w-2 rounded-full bg-accent-300"></div>
            <div className="h-2 w-2 rounded-full bg-accent-300"></div>
            <div className="h-2 w-2 rounded-full bg-accent-300"></div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Movie Pick!
          </h2>
        </div>
        <p className="ml-11 text-sm text-gray-300">
          선택하기 어렵다면 이 영화는 어때요?
        </p>
      </div>

      {/* SECTION CONTENTS */}
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-4 md:flex-row md:gap-4">
          {/* MOVIE POSTER */}
          <div className="aspect-[2/3] flex-none overflow-hidden rounded-2xl drop-shadow">
            <MoviePoster
              posterPath={currentMovie.poster_path}
              title={movieTitle}
              size={500}
            />
          </div>

          {/* MOVIE INFO CARD */}
          <div className="h-full flex-1">
            <MovieInfoCard movie={currentMovie} />
          </div>
        </div>
      </div>
    </section>
  );
}
