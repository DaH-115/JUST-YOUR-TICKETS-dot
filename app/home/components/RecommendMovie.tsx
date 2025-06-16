import { useMemo } from "react";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import getMovieTitle from "app/utils/getMovieTitle";
import MovieInfoCard from "app/home/components/MovieInfoCard";
import MoviePoster from "app/components/MoviePoster";

// 도트 컴포넌트 분리
const StaticDots = () => (
  <div className="flex space-x-1">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="h-2 w-2 rounded-full bg-accent-300" />
    ))}
  </div>
);

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
      <header className="pb-10 md:pb-8">
        <div className="mb-2 flex items-center space-x-3">
          <StaticDots />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Movie Pick!
          </h2>
        </div>
        <p className="ml-11 text-sm text-gray-300">
          선택하기 어렵다면 이 영화는 어때요?
        </p>
      </header>

      {/* SECTION CONTENTS */}
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-4 md:flex-row md:gap-4">
          {/* MOVIE POSTER */}
          <figure className="aspect-[2/3] flex-none overflow-hidden rounded-2xl drop-shadow">
            <MoviePoster
              posterPath={currentMovie.poster_path}
              title={movieTitle}
            />
          </figure>

          {/* MOVIE INFO CARD */}
          <MovieInfoCard movie={currentMovie} />
        </div>
      </div>
    </section>
  );
}
