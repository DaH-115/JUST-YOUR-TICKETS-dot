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
    <article className="relative flex flex-col items-stretch drop-shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-6 hover:drop-shadow-2xl">
      {/* RANKING NUMBER & INFO BUTTON */}
      <header className="absolute left-0 top-0 z-50 flex w-full items-center justify-between rounded-t-xl bg-gradient-to-t from-transparent to-black px-2 py-1 text-2xl font-bold text-white md:px-4 md:py-3 md:text-3xl">
        <span>{idx + 1}.</span>
        <div className="relative text-lg md:ml-2">
          <Link
            href={`/movie-details/${id}`}
            aria-label={`${movieTitle} 영화 상세정보 보기`}
            role="button"
            className="inline-block text-white/70 transition-all duration-300 ease-in-out hover:scale-110 hover:text-accent-300 hover:drop-shadow-lg active:scale-95 active:text-accent-400"
          >
            <FaInfoCircle aria-hidden />
          </Link>
          <Tooltip>{movieTitle} 영화 상세정보 보기</Tooltip>
        </div>
      </header>

      {/* MOVIE POSTER */}
      <div className="aspect-[2/3] overflow-hidden rounded-xl">
        <MoviePoster posterPath={poster_path} title={movieTitle} />
      </div>

      {/* MOVIE INFO CARD */}
      <footer className="overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50">
        {/* MOVIE TITLE */}
        <section className="border-b-4 border-dotted p-1 md:p-2">
          <h3 className="truncate text-sm font-bold">{title}</h3>
          <p className="truncate text-xs text-gray-600">{original_title}</p>
        </section>

        {/* RATING & GENRES */}
        <section className="flex items-center p-1 px-2 md:p-2">
          {/* RATE */}
          <div className="flex items-center border-r-4 border-dotted pr-2 text-xs md:text-sm">
            <IoStar className="text-accent-300 md:mr-1" />
            <span className="font-bold">
              {vote_average ? Math.round(vote_average * 10) / 10 : 0}
            </span>
          </div>
          {/* GENRES */}
          <ul className="flex w-full gap-1 overflow-x-scroll pl-2 scrollbar-hide">
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
              <li className="truncate px-2 py-1 text-xs text-gray-300 lg:text-sm">
                장르 정보가 없습니다
              </li>
            )}
          </ul>
        </section>
        {/* REVIEW WRITE BUTTON */}
        <div className="p-1">
          <WriteBtn movieId={id} size={"small"} />
        </div>
      </footer>
    </article>
  );
}
