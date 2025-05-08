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

export default function MovieInfoCard({ movie }: { movie: MovieList }) {
  const { id, title, original_title, release_date, vote_average, overview } =
    movie;
  const releaseDate = formatMovieDate(release_date);
  const { genres, cast, uniqueDirectors } = useMovieDetails();

  return (
    <section className="group mx-auto w-full break-keep rounded-xl bg-accent-300">
      <div className="rounded-xl border-2 border-gray-200 bg-white p-2 lg:transition-all lg:duration-300 lg:group-hover:-translate-x-1 lg:group-hover:-translate-y-1">
        <div className="p-4">
          <span className="mb-2 inline-block rounded-lg bg-primary-500 p-1 text-xs font-bold text-accent-50">
            추천 영화
          </span>
          <div className="flex">
            <h1 className="text-xl font-bold md:text-3xl">{title}</h1>
            <div className="group/tooltip relative ml-2">
              <Link
                href={`/movie-details/${id}`}
                aria-label={`${title}(${original_title}) 영화 상세정보 보기`}
                title={`${title}(${original_title}) 영화 상세정보 보기`}
                role="button"
              >
                <FaInfoCircle className="text-lg" aria-hidden />
              </Link>
              <Tooltip>영화 상세정보 보기</Tooltip>
            </div>
          </div>
          <div className="ml-1 flex items-center">
            <h2 className="mr-2 text-sm text-gray-500 md:text-lg">{`${original_title}(${release_date.slice(0, 4)})`}</h2>
          </div>
        </div>
        <ul className="flex items-center space-x-2 overflow-x-scroll border-y-4 border-dotted border-gray-200 p-2 text-xs scrollbar-hide">
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
        <div className="flex flex-1 items-center justify-between border-b-4 border-dotted border-gray-200">
          <ul className="flex w-full items-center justify-center gap-6 p-4 text-center text-xs">
            {cast.slice(0, 3).map((actor) => (
              <li key={actor.id} className="font-bold">
                {actor.name}
                <span className="block text-xs font-normal text-gray-500">
                  {actor.character}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex p-2">
          <div className="flex-1 border-r-4 border-dotted border-gray-200">
            <p className="pr-2 text-xs font-bold text-black">개봉일</p>
            <p className="p-2 text-center text-xs">{releaseDate}</p>
          </div>
          <div className="flex-1 border-r-4 border-dotted border-gray-200">
            <p className="px-2 text-xs font-bold text-black">감독</p>
            <ul className="p-2 text-center text-xs">
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
        <div className="flex w-full border-t-4 border-dotted border-gray-200 pt-4">
          <WriteBtn movieId={id} />
        </div>
      </div>
    </section>
  );
}
