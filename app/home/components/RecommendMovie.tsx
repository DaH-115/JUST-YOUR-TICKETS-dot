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
    <section className="py-8">
      {/* SECTION TITLE */}
      <div className="pb-8 pt-6">
        <h2 className="text-2xl font-bold text-accent-300">Movie Pick!</h2>
        <p className="text-white">선택하기 어렵다면 이 영화는 어때요?</p>
      </div>

      {/* SECTION CONTENTS */}
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-4xl gap-6">
          {/* MOVIE POSTER */}
          <div className="aspect-[2/3] flex-none rounded-xl drop-shadow">
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
