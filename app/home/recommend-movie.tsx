import { useMemo } from "react";
import { MovieList } from "api/fetchNowPlayingMovies";
import getMovieTitle from "app/utils/get-movie-title";
import MovieInfoCard from "app/home/movie-info-card";
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
    <main className="mx-auto flex flex-col items-center justify-center pb-8 md:mt-8 md:w-4/5 md:flex-row md:items-start">
      {/* MOVIE POSTER */}
      {currentMovie.poster_path && (
        <div className="w-2/3 pb-4 md:mr-4 md:w-1/3 md:py-0">
          <MoviePoster
            posterPath={currentMovie.poster_path}
            title={movieTitle}
            size={500}
          />
        </div>
      )}

      {/* MOVIE INFO CARD */}
      <div className="relative w-11/12 md:w-2/5">
        <MovieInfoCard movie={currentMovie} />
        {/* SCROLL BUTTON */}
        <div className="absolute -right-16 top-0 hidden flex-row lg:block">
          {trailerKey && (
            <div className="group/tooltip relative mb-2">
              <ScrollButton
                targetId={"movie-trailer"}
                ariaLabel={"영화 예고편 보기"}
              >
                <RiMovieLine className="text-xl" />
              </ScrollButton>
              <Tooltip>영화 예고편 보기</Tooltip>
            </div>
          )}
          <div className="group/tooltip relative">
            <ScrollButton
              targetId={"now-playing"}
              ariaLabel={"현재 상영하는 영화 보기"}
            >
              <MdLocalMovies className="text-xl" aria-hidden />
            </ScrollButton>
            <Tooltip>현재 상영하는 영화 보기</Tooltip>
          </div>
        </div>
      </div>
    </main>
  );
}
