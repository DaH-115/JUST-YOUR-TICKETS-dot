import { useMemo } from "react";
import Link from "next/link";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import getMovieTitle from "app/utils/getMovieTitle";
import { FaInfoCircle } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import WriteBtn from "app/components/WriteBtn";
import Tooltip from "app/components/Tooltip";
import MoviePoster from "app/components/MoviePoster";

export default function SwiperCard({
  idx,
  movie,
}: {
  idx: number;
  movie: MovieList;
}) {
  const { id, original_title, poster_path, title, vote_average, genres } =
    movie;
  const movieTitle = useMemo(
    () => getMovieTitle(original_title, title),
    [original_title, title],
  );

  return (
    <div className="flex flex-col items-stretch drop-shadow-lg">
      {/* RANKING NUMBER */}
      <div className="absolute left-0 top-0 z-50 flex w-full items-center justify-between rounded-t-xl bg-gradient-to-t from-transparent to-gray-900 px-4 py-3 text-3xl font-bold text-white">
        {idx + 1}.
        <div className="group/tooltip relative text-xs md:ml-2 md:text-base">
          <Link
            href={`/movie-details/${id}`}
            aria-label={`${movieTitle} 영화 상세정보 보기`}
            title={`${movieTitle} 영화 상세정보 보기`}
            role="button"
          >
            <FaInfoCircle aria-hidden />
          </Link>
          <Tooltip>영화 상세정보 보기</Tooltip>
        </div>
      </div>

      {/* MOVIE POSTER */}
      <div className="aspect-[2/3] overflow-hidden rounded-xl">
        <MoviePoster posterPath={poster_path} title={movieTitle} size={342} />
      </div>

      {/* MOVIE INFO CARD */}
      <div className="rounded-xl bg-white">
        {/* MOVIE TITLE */}
        <div className="flex items-center justify-between p-3">
          <div className="truncate text-sm font-bold">{movieTitle}</div>
        </div>
        {/* GENRES */}
        <ul className="hidden w-full gap-1 border-y-4 border-dotted p-2 scrollbar-hide md:flex md:overflow-x-scroll">
          {genres?.length > 0 ? (
            genres.slice(0, 3).map((genre, idx) => (
              <li
                className="text-nowrap rounded-full border border-primary-500 bg-white px-2 py-1 text-xs text-black transition-colors duration-300 hover:bg-primary-500 hover:text-white active:bg-black active:text-white"
                key={idx}
              >
                {genre}
              </li>
            ))
          ) : (
            <li className="px-2 py-1 text-xs text-gray-300 lg:text-sm">
              장르 정보가 없습니다
            </li>
          )}
        </ul>
        {/* RATE */}
        <div className="flex w-full p-1 text-center">
          <div className="flex items-center px-2 text-xs">
            <IoStar className="mr-1 text-accent-300" />
            <div className="font-bold">
              {Math.round(vote_average * 10) / 10}
            </div>
          </div>
          {/* REVIEW WRITE BUTTON */}
          <WriteBtn movieId={id} size={"small"} />
        </div>
      </div>
    </div>
  );
}
