"use client";

import Link from "next/link";
import { FaInfoCircle, FaStar } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import AnimatedOverview from "app/components/movie/AnimatedOverview";
import GenreList from "app/components/movie/GenreList";
import MovieCertification from "app/components/movie/MovieCertification";
import Tooltip from "app/components/ui/feedback/Tooltip";
import WriteBtn from "app/components/ui/buttons/WriteBtn";
import formatMovieDate from "app/utils/formatMovieDate";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { useMovieDetails } from "store/context/movieDetailsContext";

export default function MovieInfoCard({ movie }: { movie: MovieList }) {
  const { id, title, original_title, release_date, vote_average, overview } =
    movie;
  const releaseDate = formatMovieDate(release_date);
  const { genres, uniqueDirectors } = useMovieDetails();

  return (
    <section className="mx-auto w-full overflow-hidden break-keep rounded-2xl bg-gradient-to-br from-white to-gray-50">
      <div className="p-2">
        <div className="p-2 md:p-4 md:pb-2">
          <div className="mb-4 flex justify-between">
            <p className="inline-block rounded-lg bg-primary-500 px-2 py-1 font-mono text-xs font-bold tracking-wider text-accent-50">
              RECOMMEND MOVIE
            </p>
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
          <h2 className="text-3xl font-bold">{title}</h2>
          <div className="flex items-center gap-2">
            <h2 className="text-gray-600">{`${original_title}(${release_date.slice(0, 4)})`}</h2>
            <FaStar className="text-yellow-400" />
            <p className="text-lg font-bold">{vote_average.toFixed(1)}</p>
            <MovieCertification certification={movie.certification ?? null} />
          </div>
        </div>
        <div className="border-b-4 border-dotted px-2">
          <GenreList genres={genres} />
        </div>
        {overview && <AnimatedOverview overview={overview} />}
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
