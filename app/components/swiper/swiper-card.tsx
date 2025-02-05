import { useMemo } from "react";
import Link from "next/link";
import { MovieList } from "api/fetchNowPlayingMovies";
import getMovieTitle from "app/utils/get-movie-title";
import { FaInfoCircle } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import NewWriteBtn from "app/components/new-write-btn";
import Tooltip from "app/components/tooltip";
import MoviePoster from "app/components/movie-poster";

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
    <div className="group/card relative mb-20 drop-shadow-lg md:mb-32">
      {/* RANKING NUMBER */}
      <div className="absolute left-0 top-0 z-50 w-full rounded-t-xl bg-gradient-to-t from-transparent to-primary-700 px-2 py-1 text-lg font-bold text-white md:px-4 md:py-2 md:text-4xl">
        {idx + 1}.
      </div>
      {/* MOVIE POSTER */}
      <MoviePoster
        posterPath={poster_path}
        title={movieTitle}
        size={342}
        lazy
      />
      {/* MOVIE INFO CARD */}
      <div className="absolute -bottom-20 right-0 w-full rounded-xl border-2 border-gray-200 bg-white transition-all duration-300 ease-in-out md:-bottom-32 lg:group-hover/card:-bottom-28 lg:group-hover/card:right-2">
        {/* MOVIE TITLE & LINK */}
        <div className="flex items-center justify-between p-2 md:px-4 md:py-3">
          <div className="truncate text-sm font-bold">{movieTitle}</div>
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
        {/* GENRES */}
        <ul className="hidden w-full gap-1 border-y-4 border-dotted border-gray-200 p-2 scrollbar-hide md:flex md:overflow-x-scroll">
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
        <div className="flex w-full flex-col text-center md:flex-row">
          <div className="flex items-center border-r-4 border-dotted border-gray-200 px-2 text-xs md:px-4">
            <IoStar className="mr-1 text-accent-300" />
            <div className="font-bold">
              {Math.round(vote_average * 10) / 10}
            </div>
          </div>
          {/* REVIEW WRITE BUTTON */}
          <div className="flex w-full p-1">
            <NewWriteBtn movieId={id} size={"small"} />
          </div>
        </div>
      </div>
    </div>
  );
}
