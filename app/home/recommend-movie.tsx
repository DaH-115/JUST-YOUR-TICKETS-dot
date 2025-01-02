import Image from "next/image";
import { Movie } from "api/fetchNowPlayingMovies";
import useGetTitle from "hooks/useGetTitle";
import MovieCard from "app/home/movie-card";
import { RiMovieLine } from "react-icons/ri";
import { MdLocalMovies } from "react-icons/md";
import ScrollButton from "app/ui/scroll-button";
import Tooltip from "app/ui/tooltip";

interface RecommendMovieProps {
  currentMovie: Movie;
  trailerKey: string;
}

export default function RecommendMovie({
  currentMovie,
  trailerKey,
}: RecommendMovieProps) {
  const imgageUrl = `https://image.tmdb.org/t/p/original/${currentMovie.poster_path}`;
  const movieTitle = useGetTitle(
    currentMovie.original_title,
    currentMovie.title,
  );

  return (
    <main className="mx-auto flex flex-col items-center justify-center pb-8 lg:mt-16 lg:w-4/5 lg:flex-row lg:items-start">
      {/* MOVIE POSTER */}
      {currentMovie.poster_path && (
        <div className="group w-2/4 py-4 md:w-1/3 lg:py-0 lg:pr-6">
          <Image
            className="relative h-full w-full transform rounded-xl object-cover drop-shadow-lg transition-all duration-300 ease-in-out hover:z-50 group-hover:scale-110 group-hover:rounded-none"
            src={imgageUrl}
            alt={movieTitle}
            width={500}
            height={750}
            priority
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
