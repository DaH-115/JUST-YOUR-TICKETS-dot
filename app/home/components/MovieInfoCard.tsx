"use client";

import Link from "next/link";
import { FaInfoCircle, FaStar } from "react-icons/fa";
import AnimatedOverview from "app/components/movie/AnimatedOverview";
import GenreList from "app/components/movie/GenreList";
import MovieCertification from "app/components/movie/MovieCertification";
import Tooltip from "app/components/ui/feedback/Tooltip";
import WriteButton from "app/components/ui/buttons/WriteButton";
import formatMovieDate from "app/utils/formatMovieDate";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { useMovieDetails } from "store/context/movieDetailsContext";

export default function MovieInfoCard({ movie }: { movie: MovieList }) {
  const { id, title, original_title, release_date, vote_average, overview } =
    movie;
  const releaseDate = formatMovieDate(release_date);
  const { genres, uniqueDirectors } = useMovieDetails();

  return (
    // 영화 정보 카드 전체 섹션
    <>
      <section className="w-full overflow-hidden break-keep p-6 lg:rounded-2xl lg:bg-white">
        {/* 헤더: 영화 제목, 상세정보 아이콘, 원제목, 개봉년도, 등급 */}
        <header className="pb-2">
          <div className="flex items-center justify-between">
            <h2 className="mb-2 text-3xl font-bold">{title}</h2>
            {/* 상세정보 아이콘 및 툴팁 */}
            <div className="relative">
              <Link
                href={`/movie-details/${id}`}
                aria-label={`${title}(${original_title}) 영화 상세정보 보기`}
                role="button"
                className="inline-block text-primary-700 transition-all duration-300 ease-in-out hover:scale-110 hover:text-accent-300 hover:drop-shadow-lg active:scale-95 active:text-accent-400"
              >
                <FaInfoCircle className="text-lg" aria-hidden />
              </Link>
              <Tooltip>
                {title}({original_title}) 영화 상세정보 보기
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-gray-600">{`${original_title}(${release_date ? release_date.slice(0, 4) : "개봉일 미정"})`}</h2>
            <MovieCertification certification={movie.certification ?? null} />
          </div>
        </header>
        {/* 장르 리스트 */}
        <div className="border-b-4 border-dotted">
          <GenreList genres={genres} />
        </div>
        {/* 영화 개요 */}
        {overview && <AnimatedOverview overview={overview} />}
        {/* 개봉일, 감독, 평점 */}
        <div className="flex p-4 pb-0">
          <div className="flex-1 border-r-4 border-dotted">
            <p className="pr-2 text-xs font-bold text-black">개봉일</p>
            <p className="p-3 text-center text-sm">{releaseDate}</p>
          </div>
          <div className="flex-1 border-r-4 border-dotted">
            <p className="px-2 text-xs font-bold text-black">감독</p>
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
            <p className="px-2 text-xs font-bold text-black">평점</p>
            <div className="flex flex-1 items-center justify-center p-3">
              <FaStar className="mr-1 text-accent-300" size={24} />
              <div className="text-2xl font-bold">
                {Math.round(vote_average * 10) / 10}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 리뷰 작성 버튼 */}
      <div className="mt-4">
        <WriteButton movieId={id} />
      </div>
    </>
  );
}
