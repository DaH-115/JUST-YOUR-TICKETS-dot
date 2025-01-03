import Image from "next/image";
import { Movie } from "api/fetchNowPlayingMovies";
import getMovieTitle from "app/utils/get-movie-title";
import MovieCard from "app/home/movie-card";
import { RiMovieLine } from "react-icons/ri";
import { MdLocalMovies } from "react-icons/md";
import ScrollButton from "app/ui/scroll-button";
import Tooltip from "app/ui/tooltip";
import MoviePoster from "app/ui/movie-poster";

interface RecommendMovieProps {
  currentMovie: Movie;
  trailerKey: string;
}

export default function RecommendMovie({
  currentMovie,
  trailerKey,
}: RecommendMovieProps) {
  const movieTitle = getMovieTitle(
    currentMovie.original_title,
    currentMovie.title,
  );

  return (
    <main className="mx-auto flex flex-col items-center justify-center pb-8 lg:mt-16 lg:w-4/5 lg:flex-row lg:items-start">
      {/* MOVIE POSTER */}
      {currentMovie.poster_path && (
        <div className="w-2/4 py-4 md:w-1/3 lg:py-0 lg:pr-6">
          <MoviePoster
            posterPath={currentMovie.poster_path}
            title={movieTitle}
          />
        </div>
      )}
      {/* MOVIE CARD */}
      <div className="relative w-11/12 lg:w-2/5">
        <MovieCard movie={currentMovie} />
        <div className="absolute -right-20 top-0 hidden flex-row lg:block">
          {trailerKey && (
            <div className="group/tooltip relative">
              <ScrollButton targetId="movie-trailer">
                <RiMovieLine size={24} />
              </ScrollButton>
              <Tooltip>영화 예고편 보기</Tooltip>
            </div>
          )}
          <div className="group/tooltip relative">
            <ScrollButton targetId="now-playing">
              <MdLocalMovies className="text-2xl" />
            </ScrollButton>
            <Tooltip>현재 상영하는 영화 보기</Tooltip>
          </div>
        </div>
      </div>
    </main>
  );
}
