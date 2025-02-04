import { useMemo } from "react";
import { MovieList } from "api/fetchNowPlayingMovies";
import getMovieTitle from "app/utils/get-movie-title";
import MovieCard from "app/home/movie-card";
import { RiMovieLine } from "react-icons/ri";
import { MdLocalMovies } from "react-icons/md";
import ScrollButton from "app/components/scroll-button";
import Tooltip from "app/components/tooltip";
import MoviePoster from "app/components/movie-poster";

interface RecommendMovieProps {
  currentMovie: MovieList;
  trailerKey: string;
}

export default function RecommendMovie({
  currentMovie,
  trailerKey,
}: RecommendMovieProps) {
  const movieTitle = useMemo(
    () => getMovieTitle(currentMovie.original_title, currentMovie.title),
    [currentMovie],
  );

  return (
    <main className="mx-auto flex flex-col items-center justify-center pb-8 lg:mt-16 lg:w-4/5 lg:flex-row lg:items-start">
      {/* MOVIE POSTER */}
      {currentMovie.poster_path && (
        <div className="w-2/3 rounded-xl py-4 md:w-1/3 md:py-0 lg:mr-4">
          <MoviePoster
            posterPath={currentMovie.poster_path}
            title={movieTitle}
            size={500}
          />
        </div>
      )}

      {/* MOVIE CARD */}
      <div className="relative w-11/12 lg:w-2/5">
        <MovieCard movie={currentMovie} />
        {/* SCROLL BUTTON */}
        <div className="absolute -right-20 top-0 hidden flex-row lg:block">
          {trailerKey && (
            <div className="group/tooltip relative">
              <ScrollButton
                targetId={"movie-trailer"}
                ariaLabel={"영화 예고편 보기"}
              >
                <RiMovieLine size={24} />
              </ScrollButton>
              <Tooltip>영화 예고편 보기</Tooltip>
            </div>
          )}
          <div className="group/tooltip relative">
            <ScrollButton
              targetId={"now-playing"}
              ariaLabel={"현재 상영하는 영화 보기"}
            >
              <MdLocalMovies className="text-2xl" aria-hidden />
            </ScrollButton>
            <Tooltip>현재 상영하는 영화 보기</Tooltip>
          </div>
        </div>
      </div>
    </main>
  );
}
