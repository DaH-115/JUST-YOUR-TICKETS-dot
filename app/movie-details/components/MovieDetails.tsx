import { MovieDetails } from "lib/movies/fetchMovieDetails";
import { MovieCredits } from "lib/movies/fetchMovieCredits";
import formatMovieDate from "app/utils/formatMovieDate";
import getMovieTitle from "app/utils/getMovieTitle";
import convertRuntime from "app/movie-details/utils/convertRuntime";
import { IoStar } from "react-icons/io5";
import WriteBtn from "app/components/WriteBtn";
import MoviePoster from "app/components/MoviePoster";
import Loading from "app/loading";

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
        <div className="mx-auto w-full overflow-hidden rounded-2xl shadow-lg">
          <div className="bg-white p-6">
            {/* 기본 정보 영역 */}
            <div className="mb-6">
              <h1 className="mb-3 inline-block rounded-lg bg-primary-500 px-2 py-1 font-mono text-xs font-bold tracking-wider text-accent-50">
                MOVIE DETAILS
              </h1>
              <h2 className="break-keep text-3xl font-bold">
                {movieDetails.title}
              </h2>
              <div className="flex items-center">
                <p className="text-gray-600">
                  {movieDetails.original_title}(
                  {movieDetails.release_date.slice(0, 4)})
                </p>
              </div>
            </div>

            {/* 장르 영역 */}
            <div className="border-y-4 border-dotted py-4">
              <ul className="flex items-center space-x-2 overflow-x-scroll scrollbar-hide">
                {movieDetails.genres.map((genre) => (
                  <li
                    key={genre.id}
                    className="rounded-full border border-black px-3 py-1.5 text-xs md:text-sm"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* 평점 영역 */}
            <div className="py-4">
              <div className="flex items-center">
                <IoStar className="mr-2 text-accent-300" />
                <p className="text-2xl font-bold md:text-3xl">
                  {Math.round(movieDetails.vote_average * 10) / 10}
                  <span className="text-xl font-normal text-gray-300 md:text-2xl">
                    /10
                  </span>
                </p>
              </div>
            </div>

            {/* 줄거리 영역 */}
            {movieDetails.overview && (
              <div className="mb-6">
                <p className="break-keep leading-relaxed text-gray-800">
                  {movieDetails.overview}
                </p>
              </div>
            )}

            {/* 출연진 영역 */}
            <div className="border-t-4 border-dotted py-4">
              <h3 className="mb-3 text-sm font-bold md:text-base">출연진</h3>
              {casts.length > 0 ? (
                <ul className="space-y-2">
                  {casts.slice(0, 5).map((cast) => (
                    <li key={cast.id} className="text-sm">
                      <span className="font-medium">{cast.name}</span>
                      <p className="text-gray-600">{cast.character}</p>
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
            <div className="flex w-full items-stretch justify-between border-t-4 border-dotted py-4 text-xs md:text-sm">
              <div className="flex flex-1 flex-col">
                <h3 className="mb-2 font-bold">개봉일</h3>
                <div className="text-center">
                  <p className="break-keep">{movieDate}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col border-x-4 border-dotted px-4">
                <h3 className="mb-2 font-bold">러닝 타임</h3>
                <p className="text-center">{convertedRuntime}</p>
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="mb-2 text-xs font-bold md:text-sm">감독</h3>
                <div className="text-center">
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
            <div className="border-t-4 border-dotted pt-4">
              <h3 className="mb-3 text-sm font-bold md:text-base">제작</h3>
              <div className="space-y-1">
                {movieDetails.production_companies.map((company, idx) => (
                  <div key={idx} className="text-sm">
                    <span>{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 리뷰 작성 버튼 */}
          <WriteBtn movieId={movieDetails.id} />
        </div>
      </div>
    </main>
  );
}
