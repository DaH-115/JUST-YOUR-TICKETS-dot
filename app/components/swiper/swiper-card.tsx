import Link from "next/link";
import { useMemo } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import GenreList from "app/components/GenreList";
import MovieCertification from "app/components/MovieCertification";
import MoviePoster from "app/components/MoviePoster";
import Tooltip from "app/components/Tooltip";
import WriteBtn from "app/components/WriteBtn";
import getMovieTitle from "app/utils/getMovieTitle";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";

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
        <section className="border-b-4 border-dotted p-2">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="flex-1">
              <h3 className="line-clamp-1 text-sm font-bold">{title}</h3>
              <p className="line-clamp-1 text-xs text-gray-600">
                {original_title}
              </p>
            </div>
            {movie.certification && (
              <MovieCertification certification={movie.certification} />
            )}
          </div>
        </section>

        {/* CERTIFICATION & GENRES */}
        <section className="flex items-center px-2">
          {/* RATE */}
          <div className="flex items-center border-r-4 border-dotted pr-2 text-xs md:text-sm">
            <IoStar className="text-accent-300 md:mr-1" />
            <span className="font-bold">
              {vote_average ? Math.round(vote_average * 10) / 10 : 0}
            </span>
          </div>
          {/* GENRES */}
          <GenreList genres={(genres || []).slice(0, 3)} variant="small" />
        </section>

        {/* REVIEW WRITE BUTTON */}
        <div className="p-2">
          <WriteBtn movieId={id} size={"small"} />
        </div>
      </footer>
    </article>
  );
}
