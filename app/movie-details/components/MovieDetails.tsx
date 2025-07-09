import { IoStar } from "react-icons/io5";
import GenreList from "app/components/GenreList";
import MovieCertification from "app/components/MovieCertification";
import MoviePoster from "app/components/MoviePoster";
import WriteBtn from "app/components/WriteBtn";
import Loading from "app/loading";
import MetaInfoItem from "app/movie-details/components/MetaInfoItem";
import convertRuntime from "app/movie-details/utils/convertRuntime";
import formatMovieDate from "app/utils/formatMovieDate";
import getMovieTitle from "app/utils/getMovieTitle";
import { MovieCredits } from "lib/movies/fetchMovieCredits";
import { MovieDetails } from "lib/movies/fetchMovieDetails";

type MovieDetailCardProps = {
  movieDetails: MovieDetails;
  movieCredits: MovieCredits;
};

export default function MovieDetailCard({
  movieDetails,
  movieCredits,
}: MovieDetailCardProps) {
  const movieTitle = getMovieTitle(
    movieDetails.original_title,
    movieDetails.title,
  );
  const movieDate = formatMovieDate(movieDetails.release_date);
  const convertedRuntime = convertRuntime(Number(movieDetails.runtime));
  const casts = movieCredits?.cast || [];
  const crews = movieCredits?.crew || [];

  return (
    <main className="relative mb-12 flex w-full items-center justify-center px-4 pt-8 md:my-12 md:px-0 md:pt-16">
      <div className="flex flex-col justify-center gap-6 md:w-2/3 md:flex-row md:gap-8">
        {/* MOVIE POSTER */}
        <section className="w-full md:w-2/3">
          <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl">
            {movieDetails.poster_path ? (
              <MoviePoster
                posterPath={movieDetails.poster_path}
                title={movieTitle}
              />
            ) : (
              <Loading />
            )}
          </div>
        </section>

        {/* MOVIE INFO */}
        <div className="mx-auto w-full overflow-hidden shadow-lg">
          <div className="rounded-2xl bg-white p-4">
            {/* 기본 정보 영역 */}
            <div className="mb-4">
              <h1 className="mb-6 inline-block rounded-lg bg-primary-500 px-2 py-1 font-mono text-xs font-bold tracking-wider text-accent-50">
                MOVIE DETAILS
              </h1>
              <div className="flex items-center">
                <h2 className="mr-3 break-keep text-3xl font-bold">
                  {movieDetails.title}
                </h2>
                {movieDetails.certification && (
                  <MovieCertification
                    certification={movieDetails.certification}
                    showLabel={true}
                  />
                )}
              </div>
              <div className="flex items-center">
                <p className="text-gray-600">
                  {movieDetails.original_title}(
                  {movieDetails.release_date.slice(0, 4)})
                </p>
              </div>
            </div>

            {/* 장르 영역 */}
            <div className="border-y-4 border-dotted">
              <GenreList
                genres={movieDetails.genres.map((genre) => genre.name)}
              />
            </div>

            {/* 평점 영역 */}
            <div className="py-4">
              <div className="flex items-center">
                <IoStar className="mr-2 text-xl text-accent-300" />
                <p className="text-3xl font-bold">
                  {Math.round(movieDetails.vote_average * 10) / 10}
                  <span className="text-2xl font-normal text-gray-200">
                    /10
                  </span>
                </p>
              </div>
            </div>

            {/* 줄거리 영역 */}
            {movieDetails.overview && (
              <div className="mb-6 px-2">
                <p className="break-keep text-sm leading-relaxed text-gray-800">
                  {movieDetails.overview}
                </p>
              </div>
            )}

            {/* 출연진 영역 */}
            <div className="border-t-4 border-dotted py-4">
              <h3 className="mb-2 text-xs font-bold">출연진</h3>
              {casts.length > 0 ? (
                <ul className="space-y-2">
                  {casts.slice(0, 5).map((cast) => (
                    <li key={cast.id} className="">
                      <p className="text-sm">{cast.name}</p>
                      <p className="text-xs text-gray-600">{cast.character}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-sm text-gray-400">
                  출연진 정보가 없습니다.
                </p>
              )}
            </div>

            {/* 기타 정보 영역 */}
            <div className="flex w-full items-center justify-center border-t-4 border-dotted py-4">
              <MetaInfoItem label={"개봉일"}>
                {movieDate ? (
                  <p>{movieDate}</p>
                ) : (
                  <p className="text-gray-400">개봉일 정보가 없습니다.</p>
                )}
              </MetaInfoItem>
              <MetaInfoItem label={"러닝 타임"}>
                {convertedRuntime && convertedRuntime !== "NaN분" ? (
                  <p>{convertedRuntime}</p>
                ) : (
                  <span className="text-gray-400">
                    러닝 타임 정보가 없습니다.
                  </span>
                )}
              </MetaInfoItem>
              <MetaInfoItem label={"감독"}>
                {crews.length > 0 &&
                crews.filter((crew) => crew.job === "Director").length > 0 ? (
                  <ul className="space-y-1">
                    {crews
                      .filter((crew) => crew.job === "Director")
                      .map((crew) => (
                        <li key={crew.id}>{crew.name}</li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">감독 정보가 없습니다.</p>
                )}
              </MetaInfoItem>
            </div>

            {/* 제작사 정보 */}
            <div className="border-t-4 border-dotted pt-4">
              <h3 className="mb-3 text-xs font-bold">제작</h3>
              <div className="flex flex-wrap gap-2">
                {movieDetails.production_companies.map((company, idx) => (
                  <div
                    key={idx}
                    className="rounded-full border border-black px-3 py-1.5 text-xs"
                  >
                    {company.name}
                  </div>
                ))}
              </div>
            </div>
            {/* 리뷰 작성 버튼 */}
            <div className="mt-8">
              <WriteBtn movieId={movieDetails.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
