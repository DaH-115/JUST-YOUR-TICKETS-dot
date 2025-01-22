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
    <div className="group/card relative m-2 drop-shadow-lg">
      <div className="absolute left-0 top-0 z-50 w-full rounded-t-xl bg-gradient-to-t from-transparent to-gray-700 px-4 py-2 text-4xl font-bold text-white">
        {idx + 1}.
      </div>

      {/* MOVIE POSTER */}
      <MoviePoster posterPath={poster_path} title={movieTitle} size={342} />

      {/* MOVIE INFO CARD */}
      <div className="absolute bottom-2 right-2 w-full rounded-xl border-2 border-black bg-white transition-all duration-300 lg:bottom-0 lg:right-0 lg:group-hover/card:bottom-2 lg:group-hover/card:right-2">
        <div className="flex p-4 pb-0">
          <div className="truncate pb-2 text-lg font-bold">{movieTitle}</div>
          <div className="group/tooltip relative ml-2">
            <Link
              href={`/movie-details/${id}`}
              aria-label={`${movieTitle} 영화 상세정보 보기`}
              title={`${movieTitle} 영화 상세정보 보기`}
              role="button"
            >
              <FaInfoCircle className="lg:text-lg" aria-hidden />
            </Link>
            <Tooltip>영화 상세정보 보기</Tooltip>
          </div>
        </div>
        <ul className="flex w-full flex-wrap gap-1 border-y-4 border-dotted border-gray-200 p-1">
          {genres?.length > 0 ? (
            genres.map((genre, idx) => (
              <li
                className="rounded-full border border-primary-500 bg-white px-2 py-1 text-xs text-black transition-colors duration-300 hover:bg-primary-500 hover:text-white active:bg-black active:text-white"
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
        <div className="flex w-full text-center">
          <div className="flex items-center border-r-4 border-dotted border-gray-200 p-4">
            <IoStar className="mr-1 text-accent-300" />
            <div className="text-lg font-bold">
              {Math.round(vote_average * 10) / 10}
            </div>
          </div>
          <div className="flex w-full p-1">
            <NewWriteBtn movieId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
