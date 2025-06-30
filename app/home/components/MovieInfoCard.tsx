"use client";

import Link from "next/link";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import formatMovieDate from "app/utils/formatMovieDate";
import { useMovieDetails } from "store/context/movieDetailsContext";
import { FaInfoCircle } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import AnimatedOverview from "app/components/AnimatedOverview";
import WriteBtn from "app/components/WriteBtn";
import Tooltip from "app/components/Tooltip";
import MovieRating from "app/components/MovieRating";

export default function MovieInfoCard({ movie }: { movie: MovieList }) {
  const { id, title, original_title, release_date, vote_average, overview } =
    movie;
  const releaseDate = formatMovieDate(release_date);
  const { genres, cast, uniqueDirectors } = useMovieDetails();

  return (
    <section className="mx-auto w-full overflow-hidden break-keep rounded-2xl bg-gradient-to-br from-white to-gray-50">
      <div className="p-2">
        <div className="p-2 md:p-4">
          <div className="mb-4 flex justify-between">
            <span className="inline-block rounded-lg bg-primary-500 px-2 py-1 font-mono text-xs font-bold tracking-wider text-accent-50">
              RECOMMEND MOVIE
            </span>
            <div className="relative">
              <Link
                href={`/movie-details/${id}`}
                aria-label={`${title}(${original_title}) 영화 상세정보 보기`}
                role="button"
                className="inline-block text-gray-600 transition-all duration-300 ease-in-out hover:scale-110 hover:text-accent-300 hover:drop-shadow-lg active:scale-95 active:text-accent-400"
              >
                <FaInfoCircle className="text-lg" aria-hidden />
              </Link>
              <Tooltip>
                {title}({original_title}) 영화 상세정보 보기
              </Tooltip>
            </div>
          </div>

          <h1 className="text-3xl font-bold md:text-3xl">{title}</h1>

          <div className="flex items-center gap-2">
            <h2 className="text-gray-600 md:text-lg">{`${original_title}(${release_date.slice(0, 4)})`}</h2>
            {movie.certification && (
              <MovieRating certification={movie.certification} />
            )}
          </div>
        </div>
        <ul className="flex items-center space-x-2 overflow-x-scroll border-y-4 border-dotted p-2 text-sm scrollbar-hide md:text-xs">
          {genres.length > 0 ? (
            genres.map((genre, idx) => (
              <li
                className="rounded-full border border-black bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-primary-500 hover:text-white active:bg-white active:text-black"
                key={idx}
              >
                {genre}
              </li>
            ))
          ) : (
            <li className="px-2 py-1 text-gray-300 lg:text-sm">
              장르 정보가 없습니다
            </li>
          )}
        </ul>
        {overview && <AnimatedOverview overview={overview} />}
        <div className="flex flex-1 items-center justify-between border-b-4 border-dotted">
          <ul className="flex w-full items-center justify-center gap-4 py-4 text-center text-sm md:text-xs">
            {cast.slice(0, 3).map((actor) => (
              <li key={actor.id} className="font-bold">
                {actor.name}
                <span className="block font-normal text-gray-600">
                  {actor.character}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex p-2">
          <div className="flex-1 border-r-4 border-dotted">
            <p className="pr-2 text-xs font-bold text-black">개봉일</p>
            <p className="p-2 text-center text-sm md:text-xs">{releaseDate}</p>
          </div>
          <div className="flex-1 border-r-4 border-dotted">
            <p className="px-2 text-xs font-bold text-black">감독</p>
            <ul className="p-2 text-center text-sm md:text-xs">
              {uniqueDirectors.length > 0 ? (
                uniqueDirectors.map((director) => (
                  <li key={`director-${director.id}`}>{director.name}</li>
                ))
              ) : (
                <li className="text-gray-300">감독 정보가 없습니다</li>
              )}
            </ul>
          </div>
          <div className="flex-1">
            <p className="px-2 text-xs font-bold text-black">평점</p>
            <div className="flex flex-1 items-center justify-center p-2">
              <IoStar className="mr-1 text-accent-300" size={24} />
              <div className="text-2xl font-bold">
                {Math.round(vote_average * 10) / 10}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        {/* 리뷰 작성 버튼 */}
        <WriteBtn movieId={id} size="large" />
      </div>
    </section>
  );
}
