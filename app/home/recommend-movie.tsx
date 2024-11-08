import Image from "next/image";
import { Movie } from "api/fetchNowPlayingMovies";
import useGetTitle from "hooks/useGetTitle";
import MovieCard from "app/ui/movie-card";
import { RiMovieLine } from "react-icons/ri";
import { MdLocalMovies } from "react-icons/md";
import ScrollButton from "app/ui/scroll-button";

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
    <main className="relative mx-auto flex flex-col items-center justify-center lg:my-16 lg:w-4/5 lg:flex-row lg:items-start">
      {/* MOVIE POSTER */}
      {currentMovie.poster_path && (
        <div className="group w-2/4 py-4 lg:w-1/3 lg:py-0 lg:pr-8">
          <Image
            className="relative h-full w-full transform rounded-xl object-cover drop-shadow-lg transition-all duration-300 ease-in-out hover:z-50 group-hover:scale-150 group-hover:rounded-none lg:group-hover:scale-110"
            src={imgageUrl}
            alt={movieTitle}
            width={640}
            height={750}
            priority
          />
        </div>
      )}
      {/* MOVIE CARD */}
      <div className="relative w-11/12 lg:w-3/5">
        <MovieCard movie={currentMovie} />
        <div className="absolute -right-24 top-0 hidden flex-row">
          {trailerKey && (
            <div className="group relative">
              <ScrollButton targetId="movie-trailer">
                <RiMovieLine size={24} />
              </ScrollButton>
              <div className="invisible absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-black px-3 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
                영화 예고편 보기
              </div>
            </div>
          )}
          <div className="group relative">
            <ScrollButton targetId="now-playing">
              <MdLocalMovies size={24} />
            </ScrollButton>
            <div className="invisible absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-black px-3 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
              현재 상영하는 영화 보기
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
