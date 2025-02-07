import { useMemo } from "react";
import { MovieList } from "api/fetchNowPlayingMovies";
import getMovieTitle from "app/utils/get-movie-title";
import MovieInfoCard from "app/home/movie-info-card";
import MoviePoster from "app/components/movie-poster";

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
    <section className="py-8">
      {/* SECTION TITLE */}
      <div className="px-8 pb-8 pt-6 md:px-16">
        <h2 className="text-5xl font-bold text-accent-300 lg:text-6xl">
          Movie
          <br />
          Pick!
        </h2>
        <p className="mt-4 text-white">선택하기 어렵다면 이 영화는 어때요?</p>
      </div>
      {/* SECTION CONTETNS */}
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center md:w-2/3 md:flex-row md:items-start lg:w-4/5">
          {/* MOVIE POSTER */}
          {currentMovie.poster_path && (
            <div className="w-1/2 overflow-hidden rounded-xl pb-4 drop-shadow md:mr-4 md:w-2/6 md:py-0">
              <MoviePoster
                posterPath={currentMovie.poster_path}
                title={movieTitle}
                size={500}
              />
            </div>
          )}

          {/* MOVIE INFO CARD */}
          <div className="relative h-full w-4/5 md:w-3/6">
            <MovieInfoCard movie={currentMovie} />
          </div>
        </div>
      </div>
    </section>
  );
}
