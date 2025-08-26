"use client";

import Link from "next/link";
import { FaStar } from "react-icons/fa";
import AnimatedOverview from "app/components/movie/AnimatedOverview";
import GenreList from "app/components/movie/GenreList";
import MovieCertification from "app/components/movie/MovieCertification";
import Tooltip from "app/components/ui/feedback/Tooltip";
import WriteButton from "app/components/ui/buttons/WriteButton";
import formatMovieDate from "app/utils/formatMovieDate";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { useMovieDetails } from "store/context/movieDetailsContext";
import { IoInformationCircle } from "react-icons/io5";

export default function MovieInfoCard({ movie }: { movie: MovieList }) {
  const { id, title, original_title, release_date, vote_average, overview } =
    movie;
  const releaseDate = formatMovieDate(release_date);
  const { genres, uniqueDirectors } = useMovieDetails();

  return (
    <section className="w-full overflow-hidden break-keep rounded-t-2xl border-t-4 border-dotted border-gray-300 bg-white">
      <div className="p-6">
        {/* 헤더: 영화 제목, 상세정보 아이콘, 원제목, 개봉년도, 등급 */}
        <header>
          <div className="flex justify-between">
            <h2 className="mb-2 text-3xl font-bold">{title}</h2>
            {/* 상세정보 아이콘 및 툴팁 */}
            <div className="relative">
              <Link
                href={`/movie-details/${id}`}
                aria-label={`${title}(${original_title}) 영화 상세정보 보기`}
                role="button"
                className="inline-block transition-all duration-300 ease-in-out hover:scale-110 hover:text-accent-300"
              >
                <IoInformationCircle className="text-2xl" aria-hidden />
              </Link>
              <Tooltip>
                {title}({original_title}) 영화 상세정보 보기
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-gray-500">{`${original_title}(${release_date ? release_date.slice(0, 4) : "개봉일 미정"})`}</h2>
            <MovieCertification certification={movie.certification ?? null} />
          </div>
        </header>

        {/* 장르 리스트 */}
        <section className="py-6">
          <GenreList genres={genres} />
        </section>

        {/* 영화 개요 */}
        {overview && <AnimatedOverview overview={overview} />}

        {/* 개봉일, 감독, 평점 */}
        <section className="flex p-4 pb-0">
          <div className="flex-1">
            <p className="mb-2 text-xs font-semibold text-black">개봉일</p>
            <p className="p-3 text-center text-xs">{releaseDate}</p>
          </div>
          <div className="flex-1">
            <p className="mb-2 text-xs font-semibold text-black">감독</p>
            <ul className="p-3 text-center">
              {uniqueDirectors.length > 0 ? (
                uniqueDirectors.map((director) => (
                  <li key={`director-${director.id}`}>
                    <p className="text-sm font-bold">{director.name}</p>
                    <p className="text-xs text-gray-500">
                      {director.original_name}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-gray-300">감독 정보가 없습니다</li>
              )}
            </ul>
          </div>
          <div className="flex-1">
            <p className="mb-2 text-xs font-semibold text-black">평점</p>
            <div className="flex flex-1 items-center justify-center p-3">
              <FaStar className="mr-1 text-accent-300" size={24} />
              <div className="text-2xl font-bold">
                {Math.round(vote_average * 10) / 10}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 리뷰 작성 버튼 */}
      <section className="border-t-4 border-dotted p-4">
        <div className="flex w-full items-center justify-center rounded-full bg-primary-500 text-white">
          <WriteButton movieId={id} />
        </div>
      </section>
    </section>
  );
}
