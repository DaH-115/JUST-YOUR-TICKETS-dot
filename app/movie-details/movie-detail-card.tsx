"use client";

import Image from "next/image";
import { MovieDetails } from "api/fetchMovieDetails";
import { MovieCredits } from "api/fetchMovieCredits";
import useFormatDate from "hooks/useFormatDate";
import useGetTitle from "hooks/useGetTitle";
import useConvertRuntime from "app/movie-details/utils/useConvertRuntime";
import { IoStar } from "react-icons/io5";
import NewWriteBtn from "app/ui/new-write-btn";

type MovieDetailCardProps = {
  movieDetails: MovieDetails;
  movieCredits: MovieCredits;
};

export default function MovieDetailCard({
  movieDetails,
  movieCredits,
}: MovieDetailCardProps) {
  const movieTitle = useGetTitle(
    movieDetails.original_title,
    movieDetails.title,
  );
  const movieDate = useFormatDate(movieDetails.release_date);
  const convertedRuntime = useConvertRuntime(movieDetails.runtime);
  const casts = movieCredits?.cast || [];
  const crews = movieCredits?.crew || [];

  return (
    <main className="relative mb-8 flex w-full items-center justify-center lg:my-8">
      <div className="flex flex-col justify-center lg:w-2/3 lg:flex-row">
        {/* MOVIE POSTER */}
        <section className="mx-auto w-3/4 py-4 lg:mr-8 lg:w-2/3 lg:py-0">
          {movieDetails.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`}
              alt={movieTitle}
              width={1280}
              height={720}
              className="rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div
              className="h-full w-full animate-pulse rounded-lg bg-gray-300 shadow-lg"
              style={{ aspectRatio: "2/3" }}
            />
          )}
        </section>

        {/* MOVIE INFO */}
        <section className="mx-auto w-full rounded-xl border-2 border-black bg-white shadow-lg">
          {/* 기본 정보 영역 */}
          <div className="p-4 pb-2">
            <h1 className="mb-2 inline-block rounded-lg bg-black p-1 text-xs font-bold text-white">
              영화 정보
            </h1>
            <h2 className="break-keep text-2xl font-bold lg:text-3xl">
              {movieDetails.title}
            </h2>
            <div className="flex items-center">
              <p className="text-sm text-gray-500 lg:text-base">
                {movieDetails.original_title}
              </p>
              <p className="text-lg text-gray-500">
                <span className="px-2">•</span>
                {movieDetails.release_date.slice(0, 4)}
              </p>
            </div>
          </div>

          {/* 장르 영역 */}
          <div className="border-y border-black p-2">
            <ul className="flex items-center space-x-2 overflow-x-scroll scrollbar-hide">
              {movieDetails.genres.map((genre) => (
                <li
                  key={genre.id}
                  className="rounded-full border-2 border-black bg-black px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-white hover:text-black active:bg-white active:text-black lg:text-xs"
                >
                  {genre.name}
                </li>
              ))}
            </ul>
          </div>

          {/* 평점 영역 */}
          <div className="p-4 font-bold">
            <div className="flex items-center text-2xl md:text-4xl">
              <IoStar className="mr-2" />
              <p className="text-2xl md:text-4xl">
                {Math.round(movieDetails.vote_average * 10) / 10}
                <span className="text-xl font-normal text-gray-300 md:text-2xl">
                  /10
                </span>
              </p>
            </div>
          </div>

          {/* 줄거리 영역 */}
          {movieDetails.overview && (
            <div className="mb-12 mt-2">
              <p className="break-keep px-6 font-light">
                {movieDetails.overview}
              </p>
            </div>
          )}

          {/* 출연진 영역 */}
          <div className="border-t border-black p-2">
            <h3 className="text-xs font-bold md:text-sm">출연진</h3>
            {casts.length > 0 ? (
              <ul className="space-y-1 p-4">
                {casts.slice(0, 5).map((cast) => (
                  <li key={cast.id} className="text-sm">
                    {cast.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="w-full text-center text-sm text-gray-400">
                출연진 정보가 없습니다.
              </p>
            )}
          </div>

          {/* 기타 정보 영역 */}
          <div className="flex w-full items-stretch justify-between border-t border-black text-xs md:text-sm">
            <div className="flex flex-1 flex-col">
              <h3 className="p-2 pb-0 font-bold">개봉일</h3>
              <div className="overflow-y-auto p-2 pb-4 text-center">
                <p className="break-keep">{movieDate}</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col border-x-2 border-dotted border-gray-300">
              <h3 className="p-2 pb-0 font-bold">러닝 타임</h3>
              <p className="overflow-y-auto p-2 pb-4 text-center">
                {convertedRuntime}
              </p>
            </div>
            <div className="flex flex-1 flex-col">
              <h3 className="p-2 pb-0 text-xs font-bold md:text-sm">감독</h3>
              <div className="overflow-y-auto p-2 pb-4 text-center">
                {crews.length > 0 ? (
                  <ul className="space-y-1">
                    {crews
                      .filter((crew) => crew.job === "Director")
                      .map((crew) => (
                        <li key={crew.id}>{crew.name}</li>
                      ))}
                  </ul>
                ) : (
                  <p className="w-full text-center text-gray-400">
                    감독 정보가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 제작사 정보 */}
          <div className="flex items-center border-y border-black p-4">
            <h3 className="text-xs font-bold md:text-sm">제작</h3>
            <div className="ml-4 space-y-1 text-sm">
              {movieDetails.production_companies.map((company, index) => (
                <div key={index}>
                  <span>{company.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 작성 버튼 */}
          <div className="group flex w-full p-1 text-center text-white">
            <NewWriteBtn movieId={movieDetails.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
